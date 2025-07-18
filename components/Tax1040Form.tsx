import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Example props type, adjust as needed
interface Tax1040FormProps {
  taxpayer: {
    firstName: string;
    lastName: string;
    ssn: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    filingStatus: string;
  };
  taxData: {
    totalWages: number;
    totalNonemployeeCompensation: number;
    totalInterestIncome: number;
    totalFederalIncomeTaxWithheld: number;
    taxLiability: number;
    taxableIncome: number;
    grossIncome: number;
    refundOrAmountOwed: number;
    deduction: number;
  };
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 16,
    padding: 8,
    border: '1px solid #ccc',
    borderRadius: 4,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  col: {
    flex: 1,
  },
  table: {
    flexDirection: 'column',
    width: 'auto',
    marginVertical: 8,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    border: '1px solid #ccc',
    padding: 4,
    fontSize: 11,
  },
});

const Tax1040Form: React.FC<Tax1040FormProps> = ({ taxpayer, taxData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Form 1040 - U.S. Individual Income Tax Return</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Filing Status:</Text>
        <Text>{taxpayer.filingStatus}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Taxpayer Information</Text>
        <View style={styles.row}>
          <Text style={styles.col}>{taxpayer.firstName} {taxpayer.lastName}</Text>
          <Text style={styles.col}>SSN: {taxpayer.ssn}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.col}>{taxpayer.address}</Text>
          <Text style={styles.col}>{taxpayer.city}, {taxpayer.state} {taxpayer.zipCode}</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Income</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Wages, salaries, tips</Text>
            <Text style={styles.tableCell}>${taxData.totalWages.toLocaleString()}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Nonemployee compensation (1099-NEC)</Text>
            <Text style={styles.tableCell}>${taxData.totalNonemployeeCompensation.toLocaleString()}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Interest income (1099-INT)</Text>
            <Text style={styles.tableCell}>${taxData.totalInterestIncome.toLocaleString()}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Gross income</Text>
            <Text style={styles.tableCell}>${taxData.grossIncome.toLocaleString()}</Text>
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Deductions</Text>
        <View style={styles.row}>
          <Text style={styles.col}>Standard Deduction</Text>
          <Text style={styles.col}>${taxData.deduction.toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.col}>Taxable Income</Text>
          <Text style={styles.col}>${taxData.taxableIncome.toLocaleString()}</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Tax and Payments</Text>
        <View style={styles.row}>
          <Text style={styles.col}>Tax Liability</Text>
          <Text style={styles.col}>${taxData.taxLiability.toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.col}>Federal Income Tax Withheld</Text>
          <Text style={styles.col}>${taxData.totalFederalIncomeTaxWithheld.toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.col}>Refund / Amount Owed</Text>
          <Text style={styles.col}>{taxData.refundOrAmountOwed >= 0 ? `Refund: $${taxData.refundOrAmountOwed.toLocaleString()}` : `Owed: $${Math.abs(taxData.refundOrAmountOwed).toLocaleString()}`}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default Tax1040Form; 