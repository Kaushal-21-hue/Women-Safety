import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Dash/Sidebar";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";

const IncidentReport = () => {
  const [incidentreport, setincidentreport] = useState([]);
  const [auth] = useAuth();

  const [report, setReport] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  // ✅ Backend API
  const API = "http://localhost:5000/api/v1/incidents";

  // ================= SUBMIT INCIDENT =================
  const submitIncident = async (e) => {
    e.preventDefault();

    if (!report.trim() || !address.trim() || !pincode.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      await axios.post(API, {
        uname: auth?.user?.uname || "Anonymous",
        report,
        address,
        pincode,
      });

      toast.success("Incident reported successfully!");

      setReport("");
      setAddress("");
      setPincode("");

      getAllIncident();
    } catch (error) {
      console.log(error);
      toast.error("Error submitting incident");
    }
  };

  // ================= GET INCIDENTS =================
  const getAllIncident = async () => {
    try {
      const { data } = await axios.get(API);
      setincidentreport(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= LOAD DATA =================
  useEffect(() => {
    getAllIncident();
    window.scrollTo(0, 0);
  }, []);

  // ================= UI =================
  return (
    <div className="d-flex">
      <Sidebar />

      <div className="container mx-3">

        {/* ---------- FORM ---------- */}
        <div className="col-12">
          <h4 className="mb-3 text-danger">
            <i className="fas fa-flag me-2"></i>Report New Incident
          </h4>

          <form onSubmit={submitIncident}>
            <div className="row g-3">
              <div className="col-lg-8">
                <label className="form-label fw-bold">
                  Incident Description
                </label>

                <textarea
                  className="form-control"
                  rows="4"
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  placeholder="Provide incident details..."
                  required
                />
              </div>

              <div className="col-lg-4">
                <label className="form-label fw-bold mb-2">Location</label>

                <input
                  className="form-control mb-3"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full address"
                  required
                />

                <input
                  className="form-control"
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Pincode"
                  maxLength="6"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-danger btn-lg mt-3 px-5"
            >
              Submit Report
            </button>
          </form>
        </div>

        {/* ---------- TABLE ---------- */}
        <div className="features_wrapper mt-5">
          <div className="row">
            <div className="col-12 text-center">
              <p className="features_subtitle">
                Latest Women Incident Reported!
              </p>
              <h2 className="features_title">Women Incident Data</h2>
            </div>
          </div>
        </div>

        <table className="table table-striped table-bordered table-hover mt-3">
          <thead className="table-dark text-center">
            <tr>
              <th>Name</th>
              <th>Report</th>
              <th>Address</th>
              <th>Pincode</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {incidentreport.map((p) => (
              <tr key={p._id}>
                <td>{p.uname}</td>
                <td>{p.report}</td>
                <td>{p.address}</td>
                <td>{p.pincode}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default IncidentReport;