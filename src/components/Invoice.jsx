import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Invoice.css";
import Header from "../components/Header";
import { supabase } from "../supabaseClient";

const Invoice = () => {
  const location = useLocation();
  const { userInfo, totalAmount, cartItems, deliveryFee } = location.state;

  const promptPayNumber = "0962899742"; 
  const amount = totalAmount; 
  const lineID = "PANDP2557"; 

  // State to hold the generated InvoiceID
  const [invoiceID, setInvoiceID] = useState(null);

  // Generate QR-PromptPay link
  const generatePromptPayQR = (id, amount) => {
    const sanitizedId = id.replace(/-/g, ""); 
    return `https://promptpay.io/${sanitizedId}/${amount}`;
  };

  const promptPayURL = generatePromptPayQR(promptPayNumber, amount);

  const handlePrint = () => {
    window.print(); 
  };

  const handleConfirmOrder = async () => {
    try {
      // Insert the main invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("Invoice")
        .insert([
          {
            CustomerID: userInfo.customerID, // Ensure you pass `customerID` in `userInfo`
            Date: new Date().toISOString(),
            TotalPrice: totalAmount,
          },
        ])
        .select()
        .single(); // Get the inserted invoice

      if (invoiceError) {
        throw new Error("Failed to create invoice: " + invoiceError.message);
      }

      const newInvoiceID = invoiceData.InvoiceID;
      setInvoiceID(newInvoiceID); // Update the state with the new InvoiceID

      // Insert invoice details
      const invoiceDetails = cartItems.map((item) => ({
        InvoiceID: newInvoiceID,
        ProductID: item.ProductID,
        Quantity: item.quantity,
        TotalPrice: item.ProductPrice * item.quantity,
      }));

      const { error: detailsError } = await supabase
        .from("InvoiceDetail")
        .insert(invoiceDetails);

      if (detailsError) {
        throw new Error("Failed to create invoice details: " + detailsError.message);
      }

      // Notify user of success
      alert("Invoice and details saved successfully!");
    } catch (error) {
      console.error("Error saving invoice:", error.message);
      alert("Failed to save invoice. Please try again.");
    }
  };

  return (
    <div>
      <Header className="no-print" />
      <div className="invoice-container">
        <h2>ใบกำกับ / ใบเสร็จ</h2>
        <div className="our-company-details">
          <p><strong>
            ห้างหุ้นส่วนจำกัด พีแอนด์พี แพดพริ้นติ้ง <br />
            P&P Pad Printing Limited Partnership <br />
            464/21 หมู่ 4 ซ. พหลโยธิน <br />
            62 ตำบลคูคต อำเภอลำลูกกา <br />
            ปทุมธานี 12130 <br />
            เลขประจำตัวผู้เสียภาษี: 0133557000736<br /><br />
          </strong></p>
        </div>
        <div className="invoice-number">
          <p>
            <strong>เลขที่ใบกำกับ / ใบเสร็จ: </strong>
            {invoiceID ? invoiceID : "รอการยืนยันคำสั่งซื้อ"} {/* Display the InvoiceID or a placeholder */}
          </p>
        </div>
        <div className="invoice-details">
          <p><strong>{userInfo.isCompany ? "ชื่อบริษัท: " : "ชื่อ: "}</strong> {userInfo.isCompany ? userInfo.companyName : userInfo.name}</p>
          <p><strong>เลขประจำตัวผู้เสียภาษี:</strong> {userInfo.taxNo}</p>
          <p><strong>อีเมล:</strong> {userInfo.email}</p>
          <p><strong>ที่อยู่:</strong> {userInfo.isCompany ? userInfo.branchAddress : userInfo.address}</p>
          {userInfo.isCompany && (
            <>
              <p><strong>สาขา:</strong> {userInfo.branchName}</p>
              <p><strong>ที่อยู่สาขา:</strong> {userInfo.branchAddress}</p>
            </>
          )}
        </div>
        <div className="prod-list">
          <h3>รายการสินค้า</h3>
          <ul>
            {cartItems.map((item) => (
              <li key={item.ProductID}>
                {item.ProductName} - {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(item.ProductPrice)} 
                &nbsp;x {item.quantity}
              </li>
            ))}
          </ul>
          <p><strong>ค่าจัดส่ง:</strong> {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(deliveryFee)}</p>
          <p><strong>รวม:</strong> {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(totalAmount)}</p>
        </div>
        <div className="qr-section no-print">
          <h3>จ่ายด้วย PromptPay</h3>
          <img
            src={promptPayURL}
            alt="PromptPay QR Code"
            className="qr-code"
          />
          <p>จำนวน: {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount.toFixed(2))}</p>
        </div>
        <div className="line-id no-print">
          <p><strong>LineID:</strong> {lineID}</p>
          <p>*เมื่อชำระเงินเสร็จกรุณายืนยันการชำระโดยการส่งสลิปมาที่ Line Account ของทางร้าน</p>
        </div>

        <div className="no-print">
          <button onClick={handleConfirmOrder} className="confirm-order-btn">
            ยืนยันคำสั่งซื้อ
          </button>
          <button onClick={handlePrint} className="print-order-btn">
            พิมพ์ใบเสร็จ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
