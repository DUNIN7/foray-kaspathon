/**
 * FORAY QuickBooks Adapter (CORRECTED v2.0)
 * 
 * Maps QuickBooks Online transactions to FORAY protocol components.
 * 
 * DISCLAIMER: This code is provided for demonstration purposes only.
 * Production implementations require additional security hardening,
 * error handling, testing, and validation. Consult qualified
 * professionals before deploying in production environments.
 * 
 * Supported transaction types:
 * - Invoices (AR)
 * - Bills (AP)
 * - Payments
 * - Sales Receipts
 * - Purchase Orders
 * - Credit Memos (NEW in v2.0)
 * - Journal Entries (NEW in v2.0)
 * 
 * @version 2.0.0 (Corrected)
 * @license BSL-1.1
 */

const ForaySDK = require('./foray-sdk');
const crypto = require('crypto');

// Input validation error class
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
  
  // Validate privacy level if provided
  const validPrivacyLevels = ['minimal', 'standard', 'high', 'defense'];
  if (config.privacyLevel && !validPrivacyLevels.includes(config.privacyLevel)) {
    throw new ValidationError(
      `Invalid privacy level: ${config.privacyLevel}. Valid options: ${validPrivacyLevels.join(', ')}`,
      'privacyLevel'
    );
  }
  
  return true;
}

// Transaction validation
function validateTransaction(transaction, type) {
  if (!transaction || typeof transaction !== 'object') {
    throw new ValidationError(`${type} object is required`, type);
  }
  
  // Common required fields
  if (!transaction.Id && !transaction.DocNumber) {
    throw new ValidationError(`${type} must have Id or DocNumber`, 'Id');
  }
  
  // Type-specific validation
  switch (type) {
    case 'Invoice':
    case 'Bill':
      if (transaction.TotalAmt === undefined || transaction.TotalAmt === null) {
        throw new ValidationError(`${type} must have TotalAmt`, 'TotalAmt');
      }
      if (typeof transaction.TotalAmt !== 'number' || isNaN(transaction.TotalAmt)) {
        throw new ValidationError(`${type} TotalAmt must be a valid number`, 'TotalAmt');
      }
      break;
    case 'Payment':
      if (!transaction.TotalAmt && transaction.TotalAmt !== 0) {
        throw new ValidationError('Payment must have TotalAmt', 'TotalAmt');
      }
      break;
    case 'CreditMemo':
      if (transaction.TotalAmt === undefined) {
        throw new ValidationError('CreditMemo must have TotalAmt', 'TotalAmt');
      }
      break;
  }
  
  return true;
}

class QuickBooksForayAdapter {
  constructor(config = {}) {
    // Validate configuration
    validateConfig(config);
    
    this.sdk = new ForaySDK(config.foray || {});
    this.qbo = config.quickbooks; // QuickBooks client instance
    this.config = {
      privacyLevel: config.privacyLevel || 'standard',
      retryAttempts: config.retryAttempts || 3,
      retryDelayMs: config.retryDelayMs || 1000,
      enableLogging: config.enableLogging !== false,
      ...config
    };
    
    // Generate entity salt for privacy
    this.entitySalt = config.entitySalt || crypto.randomBytes(32).toString('hex');
    
    // Rate limiting
    this.lastRequestTime = 0;
    this.minRequestInterval = config.minRequestInterval || 100; // ms
  }

  /**
   * Log message if logging is enabled
   */
  _log(message, level = 'info') {
    if (this.config.enableLogging) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    }
  }

  /**
   * Retry wrapper for operations that may fail
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
          await this._delay(this.config.retryDelayMs * attempt);
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Delay helper
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Rate limiting helper
   */
  async _enforceRateLimit() {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    
    if (elapsed < this.minRequestInterval) {
      await this._delay(this.minRequestInterval - elapsed);
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Obfuscate amount based on privacy level
   */
  _obfuscateAmount(amount) {
    if (amount === null || amount === undefined) return null;
    if (typeof amount !== 'number' || isNaN(amount)) return null;
    
    switch (this.config.privacyLevel) {
      case 'minimal':
        return amount; // No obfuscation
      
      case 'standard':
        // Round to nearest $100
        return Math.round(amount / 100) * 100;
      
      case 'high':
        // Round to nearest $1000 + add noise
        const rounded = Math.round(amount / 1000) * 1000;
        const noise = (Math.random() - 0.5) * 500;
        return rounded + noise;
      
      case 'defense':
        // Return hash only (amount not recoverable without key)
        return crypto
          .createHash('sha256')
          .update(`${this.entitySalt}:${amount}`)
          .digest('hex');
      
      default:
        return Math.round(amount / 100) * 100;
    }
  }

  /**
   * Hash identifier for privacy
   */
  _hashIdentifier(value, type) {
    if (!value) return null;
    return crypto
      .createHash('sha256')
      .update(`${this.entitySalt}:${type}:${value}`)
      .digest('hex')
      .substring(0, 16); // Truncate for readability
  }

  /**
   * Anchor QuickBooks Invoice to FORAY
   */
  async anchorInvoice(invoice) {
    // Validate input
    validateTransaction(invoice, 'Invoice');
    
    await this._enforceRateLimit();
    
    this._log(`Anchoring QuickBooks Invoice #${invoice.DocNumber || invoice.Id} to FORAY...`);

    return await this._withRetry(async () => {
      // Step 1: Create Arrangement (invoice terms, parties)
      const arrangement = this.sdk.createArrangement({
        source_system: 'quickbooks',
        transaction_type: 'invoice',
        reference_id: this._hashIdentifier(invoice.Id, 'invoice'),
        parties: [
          {
            role: 'seller',
            identifier: this._hashIdentifier(invoice.CompanyInfo?.CompanyName, 'company'),
            legal_entity: invoice.CompanyInfo?.LegalName ? 
              this._hashIdentifier(invoice.CompanyInfo.LegalName, 'company') : null
          },
          {
            role: 'buyer',
            identifier: this._hashIdentifier(invoice.CustomerRef?.name, 'customer'),
            customer_id: this._hashIdentifier(invoice.CustomerRef?.value, 'customer')
          }
        ],
        terms: {
          payment_terms: invoice.SalesTermRef?.name || 'Net 30',
          due_date: invoice.DueDate,
          currency: invoice.CurrencyRef?.value || 'USD'
        }
      });

      this._log(`  âœ“ Arrangement created: ${arrangement.id}`);

      // Step 2: Create Accrual (revenue recognition)
      const accrual = this.sdk.createAccrual({
        arrangement_ref: arrangement.id,
        amount: this._obfuscateAmount(invoice.TotalAmt),
        currency: invoice.CurrencyRef?.value || 'USD',
        formula_id: 'invoice_total',
        formula_description: 'Sum of line items + tax',
        formula_inputs: {
          line_item_count: invoice.Line?.length || 0,
          tax_amount: this._obfuscateAmount(invoice.TxnTaxDetail?.TotalTax || 0),
          subtotal: this._obfuscateAmount(invoice.TotalAmt - (invoice.TxnTaxDetail?.TotalTax || 0))
        },
        debit_account: 'Accounts Receivable',
        credit_account: 'Revenue',
        fiscal_period: this._getFiscalPeriod(invoice.TxnDate)
      });

      this._log(`  âœ“ Accrual created: ${accrual.id}`);

      // Step 3: Create Anticipation (expected payment)
      const anticipation = this.sdk.createAnticipation({
        arrangement_ref: arrangement.id,
        expected_date: invoice.DueDate,
        expected_amount: this._obfuscateAmount(invoice.TotalAmt),
        currency: invoice.CurrencyRef?.value || 'USD',
        settlement_account: 'Cash',
        conditions: {
          payment_method: 'Any accepted method',
          partial_payment_allowed: true
        }
      });

      this._log(`  âœ“ Anticipation created: ${anticipation.id}`);

      // Step 4: Create Action if invoice is paid
      let action = null;
      if (invoice.Balance === 0 && invoice.TotalAmt > 0) {
        action = this.sdk.createAction({
          arrangement_ref: arrangement.id,
          anticipation_ref: anticipation.id,
          settlement_type: 'full_payment',
          actual_amount: this._obfuscateAmount(invoice.TotalAmt),
          settlement_date: invoice.TxnDate,
          payment_method: 'Applied'
        });
        this._log(`  âœ“ Action created: ${action.id} (PAID)`);
      }

      // Anchor to blockchain
      const transaction = this.sdk.createTransaction({
        components: {
          arrangement,
          accrual,
          anticipation,
          action
        }
      });

      const anchorResult = await this.sdk.anchorToBlockchain(transaction);
      this._log(`  âœ“ Anchored to Kaspa: ${anchorResult.kaspaHash}`);

      return {
        success: true,
        transaction,
        anchor: anchorResult,
        quickbooks_id: invoice.Id,
        privacy_level: this.config.privacyLevel
      };
    }, 'anchorInvoice');
  }

  /**
   * Anchor QuickBooks Bill to FORAY
   */
  async anchorBill(bill) {
    // Validate input
    validateTransaction(bill, 'Bill');
    
    await this._enforceRateLimit();
    
    this._log(`Anchoring QuickBooks Bill #${bill.DocNumber || bill.Id} to FORAY...`);

    return await this._withRetry(async () => {
      const arrangement = this.sdk.createArrangement({
        source_system: 'quickbooks',
        transaction_type: 'bill',
        reference_id: this._hashIdentifier(bill.Id, 'bill'),
        parties: [
          {
            role: 'vendor',
            identifier: this._hashIdentifier(bill.VendorRef?.name, 'vendor'),
            vendor_id: this._hashIdentifier(bill.VendorRef?.value, 'vendor')
          },
          {
            role: 'company',
            identifier: this._hashIdentifier(bill.CompanyInfo?.CompanyName, 'company')
          }
        ],
        terms: {
          payment_terms: bill.SalesTermRef?.name || 'Net 30',
          due_date: bill.DueDate,
          currency: bill.CurrencyRef?.value || 'USD'
        }
      });

      const accrual = this.sdk.createAccrual({
        arrangement_ref: arrangement.id,
        amount: this._obfuscateAmount(bill.TotalAmt),
        currency: bill.CurrencyRef?.value || 'USD',
        formula_id: 'bill_total',
        debit_account: 'Expense',
        credit_account: 'Accounts Payable',
        fiscal_period: this._getFiscalPeriod(bill.TxnDate)
      });

      const anticipation = this.sdk.createAnticipation({
        arrangement_ref: arrangement.id,
        expected_date: bill.DueDate,
        expected_amount: this._obfuscateAmount(bill.TotalAmt),
        currency: bill.CurrencyRef?.value || 'USD',
        settlement_account: 'Cash'
      });

      let action = null;
      if (bill.Balance === 0 && bill.TotalAmt > 0) {
        action = this.sdk.createAction({
          arrangement_ref: arrangement.id,
          anticipation_ref: anticipation.id,
          settlement_type: 'full_payment',
          actual_amount: this._obfuscateAmount(bill.TotalAmt),
          settlement_date: bill.TxnDate
        });
      }

      const transaction = this.sdk.createTransaction({
        components: { arrangement, accrual, anticipation, action }
      });

      const anchorResult = await this.sdk.anchorToBlockchain(transaction);
      
      return {
        success: true,
        transaction,
        anchor: anchorResult,
        quickbooks_id: bill.Id,
        privacy_level: this.config.privacyLevel
      };
    }, 'anchorBill');
  }

  /**
   * Anchor QuickBooks Credit Memo to FORAY (NEW in v2.0)
   */
  async anchorCreditMemo(creditMemo) {
    validateTransaction(creditMemo, 'CreditMemo');
    
    await this._enforceRateLimit();
    
    this._log(`Anchoring QuickBooks Credit Memo #${creditMemo.DocNumber || creditMemo.Id} to FORAY...`);

    return await this._withRetry(async () => {
      const arrangement = this.sdk.createArrangement({
        source_system: 'quickbooks',
        transaction_type: 'credit_memo',
        reference_id: this._hashIdentifier(creditMemo.Id, 'credit_memo'),
        parties: [
          {
            role: 'seller',
            identifier: this._hashIdentifier(creditMemo.CompanyInfo?.CompanyName, 'company')
          },
          {
            role: 'buyer',
            identifier: this._hashIdentifier(creditMemo.CustomerRef?.name, 'customer'),
            customer_id: this._hashIdentifier(creditMemo.CustomerRef?.value, 'customer')
          }
        ],
        terms: {
          reason: creditMemo.PrivateNote || 'Credit adjustment',
          original_invoice: creditMemo.LinkedTxn?.[0]?.TxnId ? 
            this._hashIdentifier(creditMemo.LinkedTxn[0].TxnId, 'invoice') : null
        }
      });

      // Credit memo reduces revenue (negative accrual)
      const accrual = this.sdk.createAccrual({
        arrangement_ref: arrangement.id,
        amount: this._obfuscateAmount(-creditMemo.TotalAmt), // Negative for credit
        currency: creditMemo.CurrencyRef?.value || 'USD',
        formula_id: 'credit_memo_total',
        debit_account: 'Revenue', // Reversal
        credit_account: 'Accounts Receivable',
        fiscal_period: this._getFiscalPeriod(creditMemo.TxnDate)
      });

      // Credit memos are typically applied immediately
      const action = this.sdk.createAction({
        arrangement_ref: arrangement.id,
        settlement_type: 'credit_applied',
        actual_amount: this._obfuscateAmount(-creditMemo.TotalAmt),
        settlement_date: creditMemo.TxnDate
      });

      const transaction = this.sdk.createTransaction({
        components: { arrangement, accrual, anticipation: null, action }
      });

      const anchorResult = await this.sdk.anchorToBlockchain(transaction);
      
      return {
        success: true,
        transaction,
        anchor: anchorResult,
        quickbooks_id: creditMemo.Id,
        privacy_level: this.config.privacyLevel
      };
    }, 'anchorCreditMemo');
  }

  /**
   * Anchor QuickBooks Journal Entry to FORAY (NEW in v2.0)
   */
  async anchorJournalEntry(journalEntry) {
    if (!journalEntry || !journalEntry.Line || !Array.isArray(journalEntry.Line)) {
      throw new ValidationError('JournalEntry must have Line array', 'Line');
    }
    
    await this._enforceRateLimit();
    
    this._log(`Anchoring QuickBooks Journal Entry #${journalEntry.DocNumber || journalEntry.Id} to FORAY...`);

    return await this._withRetry(async () => {
      // Calculate total debits (should equal total credits)
      const totalDebits = journalEntry.Line
        .filter(line => line.JournalEntryLineDetail?.PostingType === 'Debit')
        .reduce((sum, line) => sum + (line.Amount || 0), 0);

      const arrangement = this.sdk.createArrangement({
        source_system: 'quickbooks',
        transaction_type: 'journal_entry',
        reference_id: this._hashIdentifier(journalEntry.Id, 'journal_entry'),
        parties: [
          {
            role: 'company',
            identifier: this._hashIdentifier(journalEntry.CompanyInfo?.CompanyName, 'company')
          }
        ],
        terms: {
          adjustment_type: journalEntry.Adjustment ? 'Adjusting Entry' : 'Standard Entry',
          memo: journalEntry.PrivateNote ? 'Memo provided' : null
        }
      });

      const accrual = this.sdk.createAccrual({
        arrangement_ref: arrangement.id,
        amount: this._obfuscateAmount(totalDebits),
        currency: journalEntry.CurrencyRef?.value || 'USD',
        formula_id: 'journal_entry_total',
        formula_description: 'Sum of debit entries (balanced with credits)',
        line_count: journalEntry.Line.length,
        fiscal_period: this._getFiscalPeriod(journalEntry.TxnDate)
      });

      // Journal entries are effective immediately
      const action = this.sdk.createAction({
        arrangement_ref: arrangement.id,
        settlement_type: 'journal_posted',
        actual_amount: this._obfuscateAmount(totalDebits),
        settlement_date: journalEntry.TxnDate
      });

      const transaction = this.sdk.createTransaction({
        components: { arrangement, accrual, anticipation: null, action }
      });

      const anchorResult = await this.sdk.anchorToBlockchain(transaction);
      
      return {
        success: true,
        transaction,
        anchor: anchorResult,
        quickbooks_id: journalEntry.Id,
        privacy_level: this.config.privacyLevel
      };
    }, 'anchorJournalEntry');
  }

  /**
   * Batch process multiple transactions with error handling
   */
  async batchProcess(transactions, type) {
    if (!Array.isArray(transactions)) {
      throw new ValidationError('transactions must be an array', 'transactions');
    }
    
    const validTypes = ['Invoice', 'Bill', 'Payment', 'CreditMemo', 'JournalEntry'];
    if (!validTypes.includes(type)) {
      throw new ValidationError(`Invalid type: ${type}. Valid types: ${validTypes.join(', ')}`, 'type');
    }

    this._log(`Batch processing ${transactions.length} ${type}(s)...`);
    
    const results = [];
    const errors = [];
    
    const methodMap = {
      'Invoice': this.anchorInvoice.bind(this),
      'Bill': this.anchorBill.bind(this),
      'CreditMemo': this.anchorCreditMemo.bind(this),
      'JournalEntry': this.anchorJournalEntry.bind(this)
    };

    const method = methodMap[type];
    if (!method) {
      throw new ValidationError(`Batch processing not supported for type: ${type}`, 'type');
    }

    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      
      try {
        const result = await method(transaction);
        results.push({
          index: i,
          success: true,
          ...result
        });
      } catch (error) {
        this._log(`Error processing ${type} at index ${i}: ${error.message}`, 'error');
        errors.push({
          index: i,
          success: false,
          error: error.message,
          transaction_id: transaction.Id || transaction.DocNumber
        });
      }
    }

    this._log(`Batch complete: ${results.length} succeeded, ${errors.length} failed`);

    return {
      total: transactions.length,
      succeeded: results.length,
      failed: errors.length,
      results,
      errors
    };
  }

  /**
   * Get fiscal period from date
   */
  _getFiscalPeriod(dateString) {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const quarter = Math.ceil(month / 3);
      
      return {
        year,
        quarter,
        month,
        period: `${year}-Q${quarter}`
      };
    } catch (error) {
      return null;
    }
  }
}

module.exports = QuickBooksForayAdapter;
module.exports.ValidationError = ValidationError;
