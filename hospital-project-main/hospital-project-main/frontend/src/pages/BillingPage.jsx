import React, { useEffect, useState } from 'react';
import client from '../api/client';

const BillingPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [invoiceForm, setInvoiceForm] = useState({ patient: '', items: [{ description: 'Consultation', amount: 50 }], tax: 0 });
  const [paymentForm, setPaymentForm] = useState({ invoice: '', patient: '', amount: 50, method: 'Online' });

  const load = async () => {
    const { data } = await client.get('/billing/invoices');
    setInvoices(data);
  };

  useEffect(() => { load().catch(console.error); }, []);

  const createInvoice = async (e) => {
    e.preventDefault();
    await client.post('/billing/invoices', invoiceForm);
    load();
  };

  const recordPayment = async (e) => {
    e.preventDefault();
    await client.post('/billing/payments', paymentForm);
    load();
  };

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header"><h2>Generate Invoice</h2></div>
        <form className="form-grid" onSubmit={createInvoice}>
          <input placeholder="patient" value={invoiceForm.patient} onChange={(e) => setInvoiceForm({ ...invoiceForm, patient: e.target.value })} />
          <input placeholder="tax" value={invoiceForm.tax} onChange={(e) => setInvoiceForm({ ...invoiceForm, tax: e.target.value })} />
          <button className="btn btn-primary" type="submit">Create Invoice</button>
        </form>
      </section>
      <section className="panel">
        <div className="panel-header"><h2>Record Payment</h2></div>
        <form className="form-grid" onSubmit={recordPayment}>
          {['invoice', 'patient', 'amount'].map((field) => (
            <input key={field} placeholder={field} value={paymentForm[field]} onChange={(e) => setPaymentForm({ ...paymentForm, [field]: e.target.value })} />
          ))}
          <select value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}>
            <option>Online</option>
            <option>Card</option>
            <option>Cash</option>
            <option>BankTransfer</option>
          </select>
          <button className="btn btn-primary" type="submit">Save Payment</button>
        </form>
      </section>
      <section className="panel">
        <div className="panel-header"><h2>Invoices</h2></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Patient</th><th>Total</th><th>Paid</th><th>Status</th></tr></thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id}>
                  <td>{inv.patient?.user?.name || inv.patient}</td>
                  <td>${inv.total}</td>
                  <td>${inv.paidAmount}</td>
                  <td><span className={`status ${inv.status.toLowerCase()}`}>{inv.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default BillingPage;
