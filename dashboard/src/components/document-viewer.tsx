'use client';

import { X, Download, Share2 } from 'lucide-react';

interface DocumentViewerProps {
  documentId: string;
  onClose: () => void;
}

const documents: Record<string, { title: string; content: string }> = {
  '1': {
    title: 'Kitchen Remodel Proposal - River Oaks',
    content: `# Kitchen Remodel Proposal
## River Oaks Residence - Sarah Johnson

**Date:** March 25, 2026  
**Project Duration:** 12 weeks  
**Estimated Value:** $45,200

### Scope of Work

This comprehensive kitchen remodel includes:
- Complete cabinetry replacement with custom hardwood frames
- Granite countertops (2500 sq ft)
- Stainless steel appliance package (range, refrigerator, dishwasher)
- New flooring (porcelain tile, 800 sq ft)
- Updated electrical and plumbing
- New lighting fixtures and recessed lighting
- Paint and finishing

### Timeline
- Week 1-2: Demolition and structural prep
- Week 3-6: Cabinetry and countertop installation
- Week 7-10: Appliances, flooring, and electrical finishes
- Week 11-12: Paint, final trim, and cleanup

### Financial Terms
- **Total Project Cost:** $45,200
- **Deposit (Due at signing):** $15,000 (33%)
- **Progress Payment (Week 6):** $15,000 (33%)
- **Final Payment (Upon completion):** $15,200 (34%)

### Warranty & Support
- 2-year manufacturer warranty on all appliances
- 5-year labor warranty on cabinetry and installation
- 24/7 emergency support for first month post-completion

**Customer Approval:** Required  
**Status:** Pending Customer Review`,
  },
  '2': {
    title: 'Invoice #INV-2026-0847',
    content: `# Invoice

**Invoice Number:** INV-2026-0847  
**Date:** March 24, 2026  
**Customer:** Robert Chen  
**Project:** Bathroom Renovation - Westchester

---

## Billing Summary

| Item | Quantity | Rate | Amount |
|------|----------|------|--------|
| Labor - Demolition & Prep | 40 hrs | $85/hr | $3,400 |
| Materials - Fixtures & Tile | - | - | $5,600 |
| Plumbing Installation | 20 hrs | $95/hr | $1,900 |
| Electrical Work | 15 hrs | $100/hr | $1,500 |
| **Subtotal** | | | **$12,400** |
| Tax (8.25%) | | | **$1,023** |
| **Total Due** | | | **$13,423** |

---

## Payment Terms
- Due upon receipt
- 1.5% discount for payment within 10 days
- Standard net 30 days

## Accepted Payment Methods
- Bank transfer
- Credit card (3% processing fee)
- Check

**Thank you for your business!**`,
  },
  '3': {
    title: 'March 2026 Operations Report',
    content: `# Operations Report
## March 2026 Summary

**Report Date:** March 20, 2026

### Executive Summary
March was a strong month for operations with 38 active projects across all service categories. We successfully completed 12 projects and booked 24 new qualified leads.

### Key Metrics
- **Total Projects:** 38 active
- **Completed:** 12 (completion rate: 31%)
- **Revenue Generated:** $187,400
- **New Leads:** 24
- **Lead Conversion Rate:** 24%
- **Customer Satisfaction:** 4.6/5.0

### Department Performance

#### Sales
- New proposals issued: 18
- Proposals accepted: 14
- Average project value: $32,400
- Conversion rate: 78%

#### Operations
- On-time completion: 92%
- Safety incidents: 0
- Quality issues: 1 (resolved)

#### Finance
- Invoices issued: 28
- Collections rate: 94%
- Outstanding receivables: $24,300

#### Marketing
- Lead generation campaigns: 4
- Cost per lead: $145
- Marketing spend: $3,480

### Challenges & Resolutions
1. **Weather delays** - 2 roofing projects delayed by rain
2. **Material shortage** - Resolved by switching to alternative supplier
3. **Staffing** - Successfully hired 2 new carpenters

### April Outlook
- 42 projects scheduled
- 28 new leads expected
- Revenue projection: $215,000`,
  },
  '4': {
    title: 'Project Schedule - Q2 2026',
    content: `# Q2 2026 Project Schedule

## Active Projects Timeline

### April 2026
- **Kitchen Remodel (River Oaks)** - Sarah Johnson - Apr 1-28
- **Bathroom Renovation (Westlake)** - Michelle Davis - Apr 5-Jun 2
- **Roofing Replacement (Heights)** - James Wilson - Apr 8-22
- **Electrical Upgrade (Montrose)** - Thomas Anderson - Apr 12-25
- **Windows Replacement (Downtown)** - Mark Johnson - Apr 15-May 15

### May 2026
- **HVAC System Upgrade (Spring Branch)** - Karen White - May 1-Jun 15
- **Deck Construction (Pearland)** - David Thompson - May 5-Jun 2
- **Exterior Painting (Museum District)** - [Pending] - May 8-22
- **Flooring Installation (Energy Corridor)** - [Pending] - May 20-Jun 5

### June 2026
- **Foundation Repair (Midtown)** - [Pending] - Jun 1-20
- **Siding Replacement (Bellaire)** - [Pending] - Jun 5-30

## Resource Allocation
- **Carpenters:** 12 (80% allocated)
- **Electricians:** 4 (90% allocated)
- **Plumbers:** 3 (85% allocated)
- **General Labor:** 8 (75% allocated)

## Budget Status: On Track`,
  },
  '5': {
    title: 'Competitor Price Comparison',
    content: `# Market Analysis - Competitor Pricing Q1 2026

## Kitchen Remodeling Comparison
### $45,000 Project Scope (Similar to River Oaks)

| Company | Price | Labor | Timeline | Warranty |
|---------|-------|-------|----------|----------|
| **Acme Home Improvement** | $45,200 | 12 weeks | 2 years | Premium |
| Competitor A | $48,900 | 14 weeks | 1 year | Standard |
| Competitor B | $44,500 | 10 weeks | 1 year | Standard |
| Competitor C | $52,300 | 16 weeks | 2 years | Standard |

**Acme Advantage:** Competitive pricing with premium warranty and reasonable timeline

## Bathroom Renovation Comparison
### $28,000 Project Scope

| Company | Price | Timeline | Warranty |
|---------|-------|----------|----------|
| **Acme Home Improvement** | $28,900 | 8 weeks | Premium |
| Competitor A | $31,200 | 10 weeks | Standard |
| Competitor B | $26,800 | 6 weeks | Limited |
| Competitor C | $29,500 | 9 weeks | Standard |

## Market Insights
- Average market rate for kitchen remodels: $50,200
- Acme pricing is **10% below market average**
- Customer satisfaction scores: Acme (4.6/5) vs Competitors (3.8-4.2/5)
- Warranty offerings: Acme leads with premium 2-year coverage`,
  },
  '6': {
    title: 'Monthly Financial Summary',
    content: `# Financial Summary - February 2026

## Income Statement
- **Total Revenue:** $182,500
- **COGS:** $94,200 (51.6%)
- **Gross Profit:** $88,300 (48.4%)

## Operating Expenses
- **Salaries & Benefits:** $32,400
- **Equipment & Tools:** $4,800
- **Insurance:** $3,200
- **Marketing:** $3,480
- **Utilities & Office:** $1,850
- **Vehicle & Fuel:** $2,100

**Total Operating Expenses:** $47,830

## Net Income
- **Operating Income:** $40,470
- **Interest & Other:** ($500)
- **Net Profit:** $39,970 (21.9% margin)

## Cash Flow
- Beginning Balance: $45,200
- Receipts: $175,300
- Payments: ($158,400)
- Ending Balance: $62,100

## Key Metrics
- **Profit Margin:** 21.9%
- **Cash Position:** Strong
- **Days Payable Outstanding:** 22 days
- **Days Sales Outstanding:** 18 days`,
  },
};

export function DocumentViewer({ documentId, onClose }: DocumentViewerProps) {
  const doc = documents[documentId];
  if (!doc) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-surface-border rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-border">
          <h2 className="text-xl font-bold text-white">{doc.title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-raised transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="prose prose-invert max-w-none">
            <div className="space-y-4 text-gray-300">
              {doc.content.split('\n').map((line, i) => {
                if (line.startsWith('# ')) {
                  return (
                    <h1 key={i} className="text-3xl font-bold text-white mt-6 mb-4">
                      {line.replace('# ', '')}
                    </h1>
                  );
                }
                if (line.startsWith('## ')) {
                  return (
                    <h2 key={i} className="text-2xl font-bold text-white mt-5 mb-3">
                      {line.replace('## ', '')}
                    </h2>
                  );
                }
                if (line.startsWith('### ')) {
                  return (
                    <h3 key={i} className="text-lg font-semibold text-gray-200 mt-4 mb-2">
                      {line.replace('### ', '')}
                    </h3>
                  );
                }
                if (line.startsWith('- ')) {
                  return (
                    <li key={i} className="ml-6 text-gray-300">
                      {line.replace('- ', '')}
                    </li>
                  );
                }
                if (line.startsWith('|')) {
                  return (
                    <div key={i} className="my-4 overflow-x-auto">
                      <pre className="text-xs bg-surface-raised p-3 rounded border border-surface-border text-gray-300">
                        {line}
                      </pre>
                    </div>
                  );
                }
                if (line.startsWith('**') || line.startsWith('_')) {
                  return (
                    <p key={i} className="text-gray-300 font-medium">
                      {line.replace(/\*\*/g, '').replace(/__/g, '')}
                    </p>
                  );
                }
                if (line.trim() === '') {
                  return <div key={i} className="h-2" />;
                }
                return (
                  <p key={i} className="text-gray-300 leading-relaxed">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-6 border-t border-surface-border">
          <button className="p-2 rounded-lg hover:bg-surface-raised transition-colors text-gray-400 hover:text-white">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-surface-raised transition-colors text-gray-400 hover:text-white">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
