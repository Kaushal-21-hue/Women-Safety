import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Dash/Sidebar";
import { useAuth } from "../context/auth";

const Dashboard = (props) => {
  const [auth] = useAuth();
  const [emerg, setEmer] = useState([{}]);
  const [txt, setTxt] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://womensecbackend.onrender.com/api/v1/emergency`, {
          method: "GET",
          headers: { 'Content-Type': 'application/json' }
        });

        if (res.status === 200) {
          const data = await res.json();
          setEmer(data)
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (auth?.user?.role === 'admin') {
      setIsAdmin(true);
      fetchData();
    } else {
      setIsAdmin(false);
    }
  }, [auth]);

  const addChat = async (receiverId, emergId) => {
    try {
      const payload = {
        senderId: auth?.user?._id,
        receiverId,
        text: txt,
        emergId
      };
      console.log(payload);
      const res = await fetch("https://womensecbackend.onrender.com/api/v1/chats", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.status === 201) {
        alert("Chat added");
        setTxt(""); // Clear input
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info">
          <h4>Admin Panel Access Required</h4>
          <p>Please use the <a href="/admin">Admin Panel</a> for full admin features. This dashboard shows basic emergency data.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="d-flex justify-content-start">
      <Sidebar />
      <div className="container table-responsive mx-3">
        <div className='features_wrapper' style={{ marginTop: '-50px' }}>
          <div className="row">
            <div className="col-12 text-center">
              <p className="features_subtitle">Latest Women Emergency Alert !</p>
              <h2 className="features_title">Women Emergency Data</h2>
            </div>
          </div>
        </div>
        <table className="table table-striped table-bordered table-hover" style={{ marginTop: '-50px' }}>
          <thead className="table-dark text-center">
            <tr >
              <th scope="col">Name</th>
              <th scope="col">Address of Incident</th>
              <th scope="col">Map View</th>
              <th scope="col">Emergency No.</th>
              <th scope="col">Chat with victim</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {emerg.map((ee, _) => (
              <>
                <tr >
                  <th scope="row">{ee.username}</th>
                  <td>{ee.addressOfInc}</td>
                  <td><a href={`${ee.mapLct}`} target="_blank" rel="noreferrer"><button className="btn btn-primary">View in map</button></a></td>
                  <td>{ee.emergencyNo}</td>
                  <td><button className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#exampleModal">Chat</button></td>
                </tr>
                <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                        <div className="d-flex justify-content-start align-items-start">
                          <p>Hello <br /> -Rehman</p>
                        </div>
                        <div className="d-flex justify-content-end align-items-end">
                          <p>Hello <br /> -Rehman</p>
                        </div>
                        <form >
                          <div className="d-flex">
                            <input class="form-control mx-3" value={txt} onChange={(e) => setTxt(e.target.value)} type="text" placeholder="enter your message"></input>
                            <button className="btn btn-primary" onClick={() => addChat(ee.userId, ee._id)} >Submit</button>
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ))}

          </tbody>


        </table>
      </div>
    </div >
  );
};

export default Dashboard;
