/**
 * FORAY Protocol - Salesforce CRM Adapter (CORRECTED v2.0)
 * 
 * Converts Salesforce CRM transactions into FORAY components with privacy preservation.
 * Handles Opportunities, Quotes, Contracts, Orders, Cases, Accounts, Contacts, Leads.
 * 
 * DISCLAIMER: This code is provided for demonstration purposes only.
 * Production implementations require additional security hardening,
 * error handling, testing, and validation. Consult qualified
 * professionals before deploying in production environments.
 * 
 * @license BSL-1.1
 * @version 2.0.0 (Corrected)
 */

const ForaySDK = require('./foray-sdk');
const crypto = require('crypto');

// Validation error class
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

// Configuration validation
function validateConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new ValidationError('Configuration object is required', 'config');
  }
  
  const validPrivacyLevels = ['minimal', 'standard', 'high', 'defense'];
  if (config.privacyLevel && !validPrivacyLevels.includes(config.privacyLevel)) {
    throw new ValidationError(
      `Invalid privacy level: ${config.privacyLevel}. Valid options: ${validPrivacyLevels.join(', ')}`,
      'privacyLevel'
    );
  }
  
  return true;
}

// Salesforce object validation
function validateSalesforceObject(obj, objectType) {
  if (!obj || typeof obj !== 'object') {
    throw new ValidationError(`${objectType} object is required`, objectType);
  }
  
  if (!obj.Id) {
    throw new ValidationError(`${objectType} must have Id field`, 'Id');
  }
  
  // Type-specific validation
  switch (objectType) {
    case 'Opportunity':
      if (obj.Amount !== undefined && obj.Amount !== null) {
        if (typeof obj.Amount !== 'number' || isNaN(obj.Amount)) {
          throw new ValidationError('Opportunity Amount must be a valid number', 'Amount');
        }
      }
      if (obj.Probability !== undefined) {
        if (typeof obj.Probability !== 'number' || obj.Probability < 0 || obj.Probability > 100) {
          throw new ValidationError('Opportunity Probability must be between 0 and 100', 'Probability');
        }
      }
      break;
      
    case 'Quote':
      if (obj.GrandTotal !== undefined && typeof obj.GrandTotal !== 'number') {
        throw new ValidationError('Quote GrandTotal must be a number', 'GrandTotal');
      }
      break;
      
    case 'Order':
      if (obj.TotalAmount !== undefined && typeof obj.TotalAmount !== 'number') {
        throw new ValidationError('Order TotalAmount must be a number', 'TotalAmount');
      }
      break;
      
    case 'Case':
      // Cases don't require monetary amounts
      break;
  }
  
  return true;
}

class SalesforceAdapter {
  constructor(config = {}) {
    validateConfig(config);
    
    this.foray = new ForaySDK(config.forayConfig || {});
    this.salesforceInstanceUrl = config.salesforceInstanceUrl || 'https://your-instance.salesforce.com';
    this.privacyLevel = config.privacyLevel || 'standard';
    this.entitySalt = config.entitySalt || crypto.randomBytes(32).toString('hex');
    
    // Configuration with defaults
    this.config = {
      retryAttempts: config.retryAttempts || 3,
      retryDelayMs: config.retryDelayMs || 1000,
      enableLogging: config.enableLogging !== false,
      minRequestInterval: config.minRequestInterval || 100,
      ...config
    };
    
    // Rate limiting
    this.lastRequestTime = 0;
    
    // Salesforce object type mappings
    this.objectTypeMap = {
      'Opportunity': 'sales-opportunity',
      'Quote': 'sales-quote',
      'Contract': 'sales-contract',
      'Order': 'sales-order',
      'Case': 'customer-case',
      'Account': 'customer-account',
      'Lead': 'sales-lead',
      'Contact': 'customer-contact'
    };
  }

  /**
   * Logging helper
   */
  _log(message, level = 'info') {
    if (this.config.enableLogging) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [SALESFORCE-FORAY] [${level.toUpperCase()}] ${message}`);
    }
  }

  /**
   * Retry wrapper
   */
  async _withRetry(operation, operationName) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        this._log(`${operationName} failed (attempt ${attempt}/${this.config.retryAttempts}): ${error.message}`, 'warn');
        
        if (attempt < this.config.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelayMs * attempt));
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Rate limiting
   */
  async _enforceRateLimit() {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    
    if (elapsed < this.config.minRequestInterval) {
      await new Promise(resolve => setTimeout(resolve, this.config.minRequestInterval - elapsed));
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Hash identifier with entity salt for cross-transaction unlinkability
   */
  hashIdentifier(id, type) {
    if (!id) return null;
    return crypto
      .createHash('sha256')
      .update(`${this.entitySalt}:${type}:${id}`)
      .digest('hex');
  }

  /**
   * Hash non-identifiable values
   */
  hashValue(value) {
    if (!value) return null;
    return crypto
      .createHash('sha256')
      .update(String(value))
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Obfuscate monetary amounts based on privacy level
   */
  obfuscateAmount(amount) {
    if (amount === null || amount === undefined) return null;
    if (typeof amount !== 'number' || isNaN(amount)) return null;
    
    switch (this.privacyLevel) {
      case 'minimal':
        return amount;
      
      case 'standard':
        return Math.round(amount / 1000) * 1000;
      
      case 'high':
        const rounded = Math.round(amount / 10000) * 10000;
        const noise = (Math.random() - 0.5) * 5000;
        return rounded + noise;
      
      case 'defense':
        return crypto
          .createHash('sha256')
          .update(`${this.entitySalt}:${amount}`)
          .digest('hex');
      
      default:
        return Math.round(amount / 1000) * 1000;
    }
  }

  /**
   * Convert Salesforce Opportunity to FORAY transaction
   */
  async opportunityToForay(opportunity) {
    validateSalesforceObject(opportunity, 'Opportunity');
    await this._enforceRateLimit();
    
    this._log(`Converting Opportunity ${opportunity.Id} to FORAY`);
    
    return await this._withRetry(async () => {
      const opportunityId = this.hashIdentifier(opportunity.Id, 'opportunity');
      const accountId = this.hashIdentifier(opportunity.AccountId, 'account');
      const ownerId = this.hashIdentifier(opportunity.OwnerId, 'user');
      
      // Arrangement: Opportunity created, parties identified
      const arrangement = this.foray.createArrangement({
        parties: [accountId, ownerId].filter(Boolean),
        asset_type: this.objectTypeMap['Opportunity'],
        terms: {
          stage: this.hashValue(opportunity.StageName),
          type: this.hashValue(opportunity.Type),
          lead_source: this.hashValue(opportunity.LeadSource),
          created_date: opportunity.CreatedDate
        },
        effective_date: opportunity.CreatedDate,
        metadata: {
          salesforce_id: opportunityId,
          object_type: 'Opportunity'
        }
      });

      // Accrual: Revenue recognition based on Amount &times; Probability
      const amount = opportunity.Amount || 0;
      const probability = opportunity.Probability || 0;
      
      const accrual = this.foray.createAccrual({
        arrangement_hash: arrangement.hash,
        formula_id: this.foray.getFormulaId('weighted_revenue'),
        inputs: {
          amount: this.obfuscateAmount(amount),
          probability: probability,
          currency: this.hashValue(opportunity.CurrencyIsoCode || 'USD')
        },
        outputs: {
          expected_revenue: this.obfuscateAmount(amount * (probability / 100)),
          risk_adjusted_value: this.obfuscateAmount(amount * (probability / 100) * 0.85)
        },
        calculation_date: new Date().toISOString(),
        metadata: {
          stage: this.hashValue(opportunity.StageName),
          forecast_category: this.hashValue(opportunity.ForecastCategoryName)
        }
      });

      // Anticipation: Expected close date and settlement terms
      const anticipation = this.foray.createAnticipation({
        accrual_hash: accrual.hash,
        expected_date: opportunity.CloseDate,
        expected_amount: this.obfuscateAmount(amount),
        conditions: [
          {
            type: 'stage_progression',
            value: this.hashValue('Closed Won'),
            probability: probability / 100
          }
        ],
        metadata: {
          next_step: this.hashValue(opportunity.NextStep),
          days_to_close: this._calculateDaysToClose(opportunity.CloseDate)
        }
      });

      // Action: Only created when Opportunity is Closed Won
      let action = null;
      if (opportunity.StageName === 'Closed Won' && opportunity.IsClosed) {
        action = this.foray.createAction({
          anticipation_hash: anticipation.hash,
          actual_date: opportunity.CloseDate,
          actual_amount: this.obfuscateAmount(amount),
          settlement_type: 'opportunity_won',
          proof: {
            stage: this.hashValue('Closed Won'),
            is_won: opportunity.IsWon,
            closed_date: opportunity.CloseDate
          }
        });
      }

      return {
        transaction_id: opportunityId,
        salesforce_object: 'Opportunity',
        salesforce_id: opportunity.Id,
        foray_components: {
          arrangement,
          accrual,
          anticipation,
          action
        },
        timeline: {
          created: opportunity.CreatedDate,
          expected_close: opportunity.CloseDate,
          actual_close: opportunity.IsClosed ? opportunity.CloseDate : null
        },
        privacy_metadata: {
          privacy_level: this.privacyLevel,
          hashed_fields: ['Id', 'AccountId', 'OwnerId', 'StageName', 'Type', 'LeadSource'],
          obfuscated_amounts: ['Amount', 'expected_revenue', 'risk_adjusted_value']
        }
      };
    }, 'opportunityToForay');
  }

  /**
   * Convert Salesforce Quote to FORAY transaction
   */
  async quoteToForay(quote) {
    validateSalesforceObject(quote, 'Quote');
    await this._enforceRateLimit();
    
    this._log(`Converting Quote ${quote.Id} to FORAY`);
    
    return await this._withRetry(async () => {
      const quoteId = this.hashIdentifier(quote.Id, 'quote');
      const opportunityId = this.hashIdentifier(quote.OpportunityId, 'opportunity');
      const accountId = this.hashIdentifier(quote.AccountId, 'account');

      const arrangement = this.foray.createArrangement({
        parties: [accountId, this.entitySalt].filter(Boolean),
        asset_type: this.objectTypeMap['Quote'],
        terms: {
          quote_number: this.hashValue(quote.QuoteNumber),
          status: this.hashValue(quote.Status),
          valid_until: quote.ExpirationDate
        },
        effective_date: quote.CreatedDate,
        metadata: {
          salesforce_id: quoteId,
          opportunity_id: opportunityId
        }
      });

      const accrual = this.foray.createAccrual({
        arrangement_hash: arrangement.hash,
        formula_id: this.foray.getFormulaId('quote_total'),
        inputs: {
          subtotal: this.obfuscateAmount(quote.Subtotal || 0),
          discount: this.obfuscateAmount(quote.Discount || 0),
          tax: this.obfuscateAmount(quote.Tax || 0),
          shipping: this.obfuscateAmount(quote.ShippingHandling || 0)
        },
        outputs: {
          grand_total: this.obfuscateAmount(quote.GrandTotal || 0),
          total_price: this.obfuscateAmount(quote.TotalPrice || 0)
        },
        calculation_date: quote.CreatedDate
      });

      const anticipation = this.foray.createAnticipation({
        accrual_hash: accrual.hash,
        expected_date: quote.ExpirationDate,
        expected_amount: this.obfuscateAmount(quote.GrandTotal || 0),
        conditions: [
          {
            type: 'quote_acceptance',
            value: this.hashValue('Accepted'),
            probability: quote.Status === 'Presented' ? 0.5 : 0.1
          }
        ]
      });

      let action = null;
      if (quote.Status === 'Accepted') {
        action = this.foray.createAction({
          anticipation_hash: anticipation.hash,
          actual_date: quote.LastModifiedDate,
          actual_amount: this.obfuscateAmount(quote.GrandTotal || 0),
          settlement_type: 'quote_accepted',
          proof: {
            status: this.hashValue('Accepted')
          }
        });
      }

      return {
        transaction_id: quoteId,
        salesforce_object: 'Quote',
        salesforce_id: quote.Id,
        foray_components: { arrangement, accrual, anticipation, action },
        privacy_metadata: { privacy_level: this.privacyLevel }
      };
    }, 'quoteToForay');
  }

  /**
   * Convert Salesforce Order to FORAY transaction
   */
  async orderToForay(order) {
    validateSalesforceObject(order, 'Order');
    await this._enforceRateLimit();
    
    this._log(`Converting Order ${order.Id} to FORAY`);
    
    return await this._withRetry(async () => {
      const orderId = this.hashIdentifier(order.Id, 'order');
      const accountId = this.hashIdentifier(order.AccountId, 'account');

      const arrangement = this.foray.createArrangement({
        parties: [accountId, this.entitySalt].filter(Boolean),
        asset_type: this.objectTypeMap['Order'],
        terms: {
          order_number: this.hashValue(order.OrderNumber),
          type: this.hashValue(order.Type),
          status: this.hashValue(order.Status)
        },
        effective_date: order.EffectiveDate,
        metadata: {
          salesforce_id: orderId
        }
      });

      const accrual = this.foray.createAccrual({
        arrangement_hash: arrangement.hash,
        formula_id: this.foray.getFormulaId('order_total'),
        inputs: {
          total_amount: this.obfuscateAmount(order.TotalAmount || 0)
        },
        outputs: {
          revenue: this.obfuscateAmount(order.TotalAmount || 0)
        },
        calculation_date: order.EffectiveDate
      });

      const anticipation = this.foray.createAnticipation({
        accrual_hash: accrual.hash,
        expected_date: order.EndDate || this._addDays(order.EffectiveDate, 30),
        expected_amount: this.obfuscateAmount(order.TotalAmount || 0),
        conditions: [
          {
            type: 'order_activated',
            value: this.hashValue('Activated'),
            probability: order.Status === 'Draft' ? 0.8 : 1.0
          }
        ]
      });

      let action = null;
      if (order.Status === 'Activated') {
        action = this.foray.createAction({
          anticipation_hash: anticipation.hash,
          actual_date: order.ActivatedDate,
          actual_amount: this.obfuscateAmount(order.TotalAmount || 0),
          settlement_type: 'order_activated',
          proof: {
            status: this.hashValue('Activated')
          }
        });
      }

      return {
        transaction_id: orderId,
        salesforce_object: 'Order',
        salesforce_id: order.Id,
        foray_components: { arrangement, accrual, anticipation, action },
        privacy_metadata: { privacy_level: this.privacyLevel }
      };
    }, 'orderToForay');
  }

  /**
   * Convert Salesforce Case to FORAY transaction
   * NOTE: Cases do not have monetary amounts - Accrual represents effort estimation
   */
  async caseToForay(caseObj) {
    validateSalesforceObject(caseObj, 'Case');
    await this._enforceRateLimit();
    
    this._log(`Converting Case ${caseObj.Id} to FORAY`);
    
    return await this._withRetry(async () => {
      const caseId = this.hashIdentifier(caseObj.Id, 'case');
      const accountId = this.hashIdentifier(caseObj.AccountId, 'account');
      const contactId = this.hashIdentifier(caseObj.ContactId, 'contact');

      const arrangement = this.foray.createArrangement({
        parties: [accountId, contactId, this.entitySalt].filter(Boolean),
        asset_type: this.objectTypeMap['Case'],
        terms: {
          case_number: this.hashValue(caseObj.CaseNumber),
          type: this.hashValue(caseObj.Type),
          priority: this.hashValue(caseObj.Priority),
          origin: this.hashValue(caseObj.Origin)
        },
        effective_date: caseObj.CreatedDate,
        metadata: {
          salesforce_id: caseId,
          subject_hash: this.hashValue(caseObj.Subject)
        }
      });

      // NOTE: Cases don't have monetary amounts
      // Accrual represents estimated effort/cost (internal metric, not from Salesforce)
      const estimatedHours = this._calculateEstimatedEffort(caseObj);
      const estimatedCostPerHour = 100; // Configurable internal rate
      
      const accrual = this.foray.createAccrual({
        arrangement_hash: arrangement.hash,
        formula_id: this.foray.getFormulaId('case_effort'),
        inputs: {
          priority_weight: this._getPriorityWeight(caseObj.Priority),
          sla_hours: this._getSLAHours(caseObj.Priority)
        },
        outputs: {
          // NOTE: These are ESTIMATED values, not actual Salesforce data
          estimated_effort_hours: estimatedHours,
          estimated_cost: this.obfuscateAmount(estimatedHours * estimatedCostPerHour)
        },
        calculation_date: caseObj.CreatedDate,
        metadata: {
          note: 'Estimated values based on priority heuristics, not Salesforce data'
        }
      });

      const anticipation = this.foray.createAnticipation({
        accrual_hash: accrual.hash,
        expected_date: this._calculateSLADeadline(caseObj),
        expected_amount: null, // Cases don't have monetary settlement
        conditions: [
          {
            type: 'case_resolved',
            value: this.hashValue('Closed'),
            probability: this._getResolutionProbability(caseObj)
          }
        ],
        metadata: {
          escalated: caseObj.IsEscalated || false
        }
      });

      let action = null;
      if (caseObj.IsClosed) {
        action = this.foray.createAction({
          anticipation_hash: anticipation.hash,
          actual_date: caseObj.ClosedDate,
          actual_amount: null,
          settlement_type: 'case_closed',
          proof: {
            status: this.hashValue(caseObj.Status),
            reason: this.hashValue(caseObj.Reason)
          }
        });
      }

      return {
        transaction_id: caseId,
        salesforce_object: 'Case',
        salesforce_id: caseObj.Id,
        foray_components: { arrangement, accrual, anticipation, action },
        privacy_metadata: { privacy_level: this.privacyLevel }
      };
    }, 'caseToForay');
  }

  /**
   * Convert Salesforce Account to FORAY (NEW in v2.0)
   */
  async accountToForay(account) {
    validateSalesforceObject(account, 'Account');
    await this._enforceRateLimit();
    
    this._log(`Converting Account ${account.Id} to FORAY`);
    
    return await this._withRetry(async () => {
      const accountId = this.hashIdentifier(account.Id, 'account');
      const ownerId = this.hashIdentifier(account.OwnerId, 'user');

      const arrangement = this.foray.createArrangement({
        parties: [accountId, ownerId].filter(Boolean),
        asset_type: this.objectTypeMap['Account'],
        terms: {
          account_type: this.hashValue(account.Type),
          industry: this.hashValue(account.Industry),
          rating: this.hashValue(account.Rating)
        },
        effective_date: account.CreatedDate,
        metadata: {
          salesforce_id: accountId,
          name_hash: this.hashValue(account.Name)
        }
      });

      // Accounts may have annual revenue
      const accrual = this.foray.createAccrual({
        arrangement_hash: arrangement.hash,
        formula_id: this.foray.getFormulaId('account_value'),
        inputs: {
          annual_revenue: this.obfuscateAmount(account.AnnualRevenue || 0),
          number_of_employees: account.NumberOfEmployees || 0
        },
        outputs: {
          estimated_value: this.obfuscateAmount(account.AnnualRevenue || 0)
        },
        calculation_date: account.CreatedDate
      });

      return {
        transaction_id: accountId,
        salesforce_object: 'Account',
        salesforce_id: account.Id,
        foray_components: { arrangement, accrual, anticipation: null, action: null },
        privacy_metadata: { privacy_level: this.privacyLevel }
      };
    }, 'accountToForay');
  }

  /**
   * Convert Salesforce Lead to FORAY (NEW in v2.0)
   */
  async leadToForay(lead) {
    validateSalesforceObject(lead, 'Lead');
    await this._enforceRateLimit();
    
    this._log(`Converting Lead ${lead.Id} to FORAY`);
    
    return await this._withRetry(async () => {
      const leadId = this.hashIdentifier(lead.Id, 'lead');
      const ownerId = this.hashIdentifier(lead.OwnerId, 'user');

      const arrangement = this.foray.createArrangement({
        parties: [leadId, ownerId].filter(Boolean),
        asset_type: this.objectTypeMap['Lead'],
        terms: {
          status: this.hashValue(lead.Status),
          lead_source: this.hashValue(lead.LeadSource),
          rating: this.hashValue(lead.Rating)
        },
        effective_date: lead.CreatedDate,
        metadata: {
          salesforce_id: leadId,
          company_hash: this.hashValue(lead.Company)
        }
      });

      let action = null;
      if (lead.IsConverted) {
        action = this.foray.createAction({
          arrangement_hash: arrangement.hash,
          actual_date: lead.ConvertedDate,
          settlement_type: 'lead_converted',
          proof: {
            converted_account: this.hashIdentifier(lead.ConvertedAccountId, 'account'),
            converted_contact: this.hashIdentifier(lead.ConvertedContactId, 'contact'),
            converted_opportunity: this.hashIdentifier(lead.ConvertedOpportunityId, 'opportunity')
          }
        });
      }

      return {
        transaction_id: leadId,
        salesforce_object: 'Lead',
        salesforce_id: lead.Id,
        foray_components: { arrangement, accrual: null, anticipation: null, action },
        privacy_metadata: { privacy_level: this.privacyLevel }
      };
    }, 'leadToForay');
  }

  /**
   * Batch process Salesforce records with comprehensive error handling
   */
  async batchProcess(records, objectType) {
    if (!Array.isArray(records)) {
      throw new ValidationError('records must be an array', 'records');
    }
    
    const validTypes = ['Opportunity', 'Quote', 'Order', 'Case', 'Account', 'Lead'];
    if (!validTypes.includes(objectType)) {
      throw new ValidationError(`Invalid objectType: ${objectType}. Valid types: ${validTypes.join(', ')}`, 'objectType');
    }

    this._log(`Batch processing ${records.length} ${objectType}(s)...`);
    
    const converterMap = {
      'Opportunity': this.opportunityToForay.bind(this),
      'Quote': this.quoteToForay.bind(this),
      'Order': this.orderToForay.bind(this),
      'Case': this.caseToForay.bind(this),
      'Account': this.accountToForay.bind(this),
      'Lead': this.leadToForay.bind(this)
    };

    const converter = converterMap[objectType];
    const results = [];
    const errors = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      try {
        const transaction = await converter(record);
        await this.foray.anchorTransaction(transaction);
        results.push({
          index: i,
          success: true,
          ...transaction
        });
      } catch (error) {
        this._log(`Error processing ${objectType} at index ${i}: ${error.message}`, 'error');
        errors.push({
          index: i,
          success: false,
          record_id: record.Id,
          error: error.message
        });
      }
    }

    this._log(`Batch complete: ${results.length} succeeded, ${errors.length} failed`);

    return {
      total: records.length,
      succeeded: results.length,
      failed: errors.length,
      results,
      errors
    };
  }

  // Helper methods
  _calculateDaysToClose(closeDate) {
    if (!closeDate) return null;
    const today = new Date();
    const close = new Date(closeDate);
    const diffTime = close - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  _addDays(dateString, days) {
    if (!dateString) return null;
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  _getPriorityWeight(priority) {
    const weights = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return weights[priority] || 1;
  }

  _getSLAHours(priority) {
    const sla = { 'High': 4, 'Medium': 24, 'Low': 72 };
    return sla[priority] || 24;
  }

  _calculateSLADeadline(caseObj) {
    if (!caseObj.CreatedDate) return null;
    const created = new Date(caseObj.CreatedDate);
    const hours = this._getSLAHours(caseObj.Priority);
    created.setHours(created.getHours() + hours);
    return created.toISOString();
  }

  _calculateEstimatedEffort(caseObj) {
    const baseHours = { 'High': 8, 'Medium': 4, 'Low': 2 };
    return baseHours[caseObj.Priority] || 2;
  }

  _getResolutionProbability(caseObj) {
    if (!caseObj.CreatedDate) return 0.5;
    const ageInDays = -this._calculateDaysToClose(caseObj.CreatedDate);
    const slaHours = this._getSLAHours(caseObj.Priority);
    
    if (ageInDays < 0) return 0.9;
    if (ageInDays < slaHours / 24) return 0.7;
    return 0.5;
  }
}

module.exports = SalesforceAdapter;
module.exports.ValidationError = ValidationError;
