import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { MdSearch, MdArrowDropDown, MdPrint, MdAssessment } from "react-icons/md";
import { RiShieldFlashLine } from "react-icons/ri";

function Reports() {
  const [studentsList, setStudentsList] = useState([]);
  const [studentSearchInput, setStudentSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    fetchStudentsDirectory();
  }, []);

  // 1. Fetch compact student database with financial tracking variables
  async function fetchStudentsDirectory() {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("student_id, name, class, total_fee, other_fee, discount_fee, total_paid, father_name, phone");
      if (error) throw error;
      setStudentsList(data || []);
    } catch (err) {
      console.error("Error loading student references:", err);
    }
  }

  // 2. Filter student registry results based on dropdown input
  const filteredStudentSearchOptions = studentsList.filter(s =>
    s.name?.toLowerCase().includes(studentSearchInput.toLowerCase()) ||
    s.student_id?.toLowerCase().includes(studentSearchInput.toLowerCase())
  );

  // 3. Selection handler to map student data to layout views
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setStudentSearchInput(`${student.name} (${student.student_id})`);
    setShowDropdown(false);
  };

  // 4. Trigger print engine layout context
  const handlePrintReceipt = () => {
    if (!selectedStudent) return;
    setIsPrinting(true);
    
    // Tiny delay to ensure state updating sets perfectly before opening hardware dialog
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 150);
  };

  // Safe numerical structural mapping defaults
  const totalFee = Number(selectedStudent?.total_fee || 0);
  const otherFee = Number(selectedStudent?.other_fee || 0);
  const discountFee = Number(selectedStudent?.discount_fee || 0);
  const totalPaid = Number(selectedStudent?.total_paid || 0);
  const calculatedFeePayable = (totalFee + otherFee) - discountFee;
  const remainingBalance = calculatedFeePayable - totalPaid;

  // Generate dynamic snapshot tracking code numbers matching current seconds timestamp 
  const dynamicReceiptCode = `RCPT-${Date.now().toString().slice(-6)}`;
  const currentFormattedDate = new Date().toISOString().split("T")[0];

  return (
    <>
      {/* ==========================================================================
         WEB INTERFACE SCREEN LAYER (Hidden automatically via print configurations)
         ========================================================================== */}
      <div className="no-print" style={{ maxWidth: "800px", margin: "0 auto", padding: "20px 0" }}>
        
        <div className="page-header" style={{ marginBottom: "30px" }}>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <MdAssessment style={{ color: "#818cf8" }} /> Student Billing Reports & Receipts
          </h1>
          <p className="page-subtitle">Search a student profile to audit their ledger summary sheets or issue a printable statement voucher</p>
        </div>

        {/* SEARCH BAR COMPONENT LAYER */}
        <div className="card" style={{ position: "relative", padding: "24px", marginBottom: "24px" }}>
          <strong style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#e5e7eb" }}>
            Search Student Profile (Type Name or Student ID)
          </strong>
          <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
            <MdSearch style={{ position: "absolute", left: "14px", color: "var(--muted)", fontSize: "22px" }} />
            <input 
              type="text" 
              placeholder="Search by ID or student name..." 
              value={studentSearchInput}
              onChange={(e) => {
                setStudentSearchInput(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              style={{ width: "100%", padding: "14px 40px 14px 45px", fontSize: "15px", borderRadius: "10px" }}
            />
            <MdArrowDropDown style={{ position: "absolute", right: "14px", color: "var(--muted)", fontSize: "24px", pointerEvents: "none" }} />
          </div>

          {/* Autocomplete floating list */}
          {showDropdown && (
            <div style={{ position: "absolute", top: "100%", left: "24px", right: "24px", background: "#1f2937", border: "1px solid var(--border)", borderRadius: "10px", marginTop: "6px", maxHeight: "220px", overflowY: "auto", zIndex: 1000, boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
              {filteredStudentSearchOptions.length === 0 ? (
                <div style={{ padding: "14px", color: "var(--muted)", fontSize: "14px", textAlign: "center" }}>No student entries matched that search text</div>
              ) : (
                filteredStudentSearchOptions.map((student) => (
                  <div 
                    key={student.student_id} 
                    onClick={() => handleSelectStudent(student)}
                    style={{ padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.02)", fontSize: "14px", color: "#fff", display: "flex", justifyContent: "space-between", transition: "background 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{ fontWeight: "500" }}>{student.name}</span>
                    <span style={{ color: "#a5b4fc", fontSize: "13px" }}>{student.student_id}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* LEDGER REPORT PREVIEW CONTAINER */}
        {selectedStudent ? (
          <div className="card" style={{ padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>
              <div>
                <h2 style={{ margin: 0, color: "#fff", fontSize: "20px" }}>{selectedStudent.name}</h2>
                <p style={{ margin: "4px 0 0 0", color: "var(--muted)", fontSize: "13px" }}>ID reference number: {selectedStudent.student_id}</p>
              </div>
              <button className="theme-btn" style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: 0, padding: "10px 20px" }} onClick={handlePrintReceipt}>
                <MdPrint style={{ fontSize: "18px" }} /> Print Official Statement
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px", fontSize: "14px" }}>
              <p style={{ margin: 0 }}><strong style={{ color: "var(--muted)" }}>Course:</strong> {selectedStudent.class || "—"}</p>
              <p style={{ margin: 0 }}><strong style={{ color: "var(--muted)" }}>Father Name:</strong> {selectedStudent.father_name || "—"}</p>
              <p style={{ margin: 0 }}><strong style={{ color: "var(--muted)" }}>Mobile Contact:</strong> {selectedStudent.phone || "—"}</p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: "var(--muted)" }}>Account State:</strong>{" "}
                <span style={{ color: remainingBalance > 0 ? "#f87171" : "#4ade80", fontWeight: "600" }}>
                  {remainingBalance > 0 ? "Dues Outstanding" : "Account Cleared ✓"}
                </span>
              </p>
            </div>

            {/* Quick summary cards dashboard metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "10px" }}>
                <h4 style={{ margin: "0 0 6px 0", color: "var(--muted)", fontSize: "12px", textTransform: "uppercase" }}>Net Fee Payable</h4>
                <p style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#fff" }}>₹{calculatedFeePayable}</p>
              </div>
              <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "10px" }}>
                <h4 style={{ margin: "0 0 6px 0", color: "var(--muted)", fontSize: "12px", textTransform: "uppercase" }}>Total Fees Collected</h4>
                <p style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#4ade80" }}>₹{totalPaid}</p>
              </div>
              <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "10px" }}>
                <h4 style={{ margin: "0 0 6px 0", color: "var(--muted)", fontSize: "12px", textTransform: "uppercase" }}>Remaining Balance</h4>
                <p style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: remainingBalance > 0 ? "#f87171" : "#4ade80" }}>₹{remainingBalance}</p>
              </div>
            </div>

          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px", border: "2px dashed var(--border)", borderRadius: "12px" }}>
            <p style={{ margin: 0, color: "var(--muted)" }}>No profiles queried yet. Select a student above to review accounting layouts or print vouchers.</p>
          </div>
        )}
      </div>

      {/* ==========================================================================
         HIGH-FIDELITY PRINT CANVAS MODULE SHEET LAYOUT (Triggered only via browser hardware print actions)
         ========================================================================== */}
      {selectedStudent && (
        <div className="print-only-layout" style={{ color: "#000", background: "#fff", padding: "40px", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
          
          {/* Header Institutional Identity */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #000", paddingBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ background: "#111827", padding: "10px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <RiShieldFlashLine size={32} color="#818cf8" />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", letterSpacing: "-0.5px", color: "#111827" }}>SYNAPSE AWS</h1>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#4b5563" }}>Patna, Bihar, India • Contact: support@synapse.edu</p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#111827" }}>BILL OUTSTANDING</h2>
              <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#1f2937" }}><strong>Doc Code Reference:</strong> {dynamicReceiptCode}</p>
              <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#4b5563" }}><strong>Date of Generation:</strong> {currentFormattedDate}</p>
            </div>
          </div>

          {/* Student Profile Identity Meta Lines */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", margin: "30px 0", padding: "18px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div>
              <p style={{ margin: "0 0 8px 0", fontSize: "13px" }}><strong>Student ID:</strong> {selectedStudent.student_id}</p>
              <p style={{ margin: "0 0 8px 0", fontSize: "13px" }}><strong>Student Name:</strong> {selectedStudent.name}</p>
              <p style={{ margin: "0", fontSize: "13px" }}><strong>Assigned Class/Course:</strong> {selectedStudent.class || "—"}</p>
            </div>
            <div>
              <p style={{ margin: "0 0 8px 0", fontSize: "13px" }}><strong>Father / Guardian Name:</strong> {selectedStudent.father_name || "—"}</p>
              <p style={{ margin: "0 0 8px 0", fontSize: "13px" }}><strong>Registered Mobile No:</strong> {selectedStudent.phone || "—"}</p>
              <p style={{ margin: "0", fontSize: "13px" }}><strong>Ledger Status Tag:</strong> {remainingBalance <= 0 ? "Account Satisfied ✓" : "Dues Unresolved"}</p>
            </div>
          </div>

          {/* Accounting Ledger Row Lists Grid Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead>
              <tr style={{ background: "#111827", color: "#fff" }}>
                <th style={{ padding: "12px", textAlign: "left", fontSize: "13px", fontWeight: "600" }}>Account Ledger Summary Ledger Line Allocation</th>
                <th style={{ padding: "12px", textAlign: "right", fontSize: "13px", fontWeight: "600", width: "150px" }}>Amount Balance (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "12px", fontSize: "13px", color: "#374151" }}>Standard Course Fee</td>
                <td style={{ padding: "12px", textAlign: "right", fontSize: "13px", color:"#000000" }}>₹{totalFee}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "12px", fontSize: "13px", color: "#374151" }}>Other Miscellaneous Fees</td>
                <td style={{ padding: "12px", textAlign: "right", fontSize: "13px", color:"#000000"}}>₹{otherFee}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "12px", fontSize: "13px", color: "#b91c1c", fontStyle: "italic" }}>Less: Granted Waivers / Concessions (-)</td>
                <td style={{ padding: "12px", textAlign: "right", fontSize: "13px", color: "#b91c1c" }}>-₹{discountFee}</td>
              </tr>
              <tr style={{ background: "#f3f4f6", fontWeight: "700" }}>
                <td style={{ padding: "12px", fontSize: "13px", color: "#111827" }}>Net Calculated Fees</td>
                <td style={{ padding: "12px", textAlign: "right", fontSize: "13px", color: "#0014ac" }}>₹{calculatedFeePayable}</td>
              </tr>
              <tr style={{ background: "#ecfdf5", fontWeight: "700", borderTop: "2px solid #047857" }}>
                <td style={{ padding: "12px", fontSize: "13px", color: "#047857" }}>FEES RECEIVED (CREDIT)</td>
                <td style={{ padding: "12px", textAlign: "right", fontSize: "14px", color: "#047857" }}>-₹{totalPaid}</td>
              </tr>
              <tr style={{ background: remainingBalance > 0 ? "#fef2f2" : "#f0fdf4", fontWeight: "700", borderTop: "1px dashed #6b7280" }}>
                <td style={{ padding: "12px", fontSize: "13px", color: remainingBalance > 0 ? "#b91c1c" : "#15803d" }}>REMAINING DUES / BALANCE</td>
                <td style={{ padding: "12px", textAlign: "right", fontSize: "14px", color: remainingBalance > 0 ? "#b91c1c" : "#15803d" }}>
                  {remainingBalance > 0 ? `₹${remainingBalance}` : "Fully Settled ✓"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer Voucher Signatures Allocation Row */}
          <div style={{ marginTop: "100px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p style={{ margin: "0", fontSize: "11px", color: "#6b7280" }}>* Certified institutional financial database account extract statement summaries.</p>
              <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "#6b7280" }}>Authorized audit document generated from cloud records engine.</p>
            </div>
            <div style={{ textAlign: "center", width: "200px" }}>
              <div style={{ borderBottom: "1px solid #000", width: "100%", marginBottom: "8px" }}></div>
              <p style={{ margin: "0", fontSize: "12px", fontWeight: "600", color: "#111827" }}>Auditor Stamp</p>
            </div>
          </div>

        </div>
      )}
    </>
  );
}

export default Reports;