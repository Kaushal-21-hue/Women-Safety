import React, { useState, useEffect, useCallback, useRef } from "react";
import "../styles/Emergency.css";
import { PiSirenBold } from "react-icons/pi";
import Parallelx from "../Components/Parallelx";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import EmergencyMap from "../Components/Map/EmergencyMap";
import EmergencyContactsManager from "../Components/EmergencyContacts/EmergencyContactsManager";
import { FaUsers, FaUserCheck } from "react-icons/fa";
import { useAuth } from "../context/auth";
import { useTheme } from "../context/ThemeContext";

import toast from "react-hot-toast";


// Category icons - Fixed with available exports
import { FaHospital, FaFireAlt, FaShieldAlt, FaMicrophone, FaMicrophoneSlash, FaPhone } from "react-icons/fa";

const Emergency = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [long, setLong] = useState("");
  const [lat, setLat] = useState("");
  const [nearbyData, setNearbyData] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState([]);
  const [savedContacts, setSavedContacts] = useState([]);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [auth, , authLoading] = useAuth();

  // Voice Recognition State
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);
  const recognitionRef = useRef(null);
  const sirenAudioRef = useRef(null);

  const hasContactsSelected = selectedContactIds.length > 0;
  const readyForSOS = !authLoading && !!auth?.token && !!auth?.user?._id && !!lat && !!long;
  const confirmSendAll = () => {
    if (!hasContactsSelected && window.confirm('No contacts selected. Send to all saved contacts?')) {
      return true;
    }
    return hasContactsSelected;
  };

  const CONTACTS_STORAGE_KEY = "emergency_saved_contacts";

  useEffect(() => {
    const stored = window.localStorage.getItem(CONTACTS_STORAGE_KEY);
    if (stored) {
      try {
        setSavedContacts(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse saved contacts", error);
      }
    }
  }, []);

  const saveLocalContacts = (contacts) => {
    setSavedContacts(contacts);
    window.localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
  };

  const handleSaveContact = (e) => {
    e.preventDefault();

    if (!contactName.trim() || !contactPhone.trim()) {
      toast.error("Name and phone are required");
      return;
    }

    const normalizedPhone = contactPhone.trim();
    const newContact = {
      id: Date.now().toString(),
      name: contactName.trim(),
      phone: normalizedPhone,
    };

    saveLocalContacts([...savedContacts, newContact]);
    setContactName("");
    setContactPhone("");
    toast.success("Contact saved locally");
  };

  const handleRemoveLocalContact = (id) => {
    saveLocalContacts(savedContacts.filter((contact) => contact.id !== id));
    toast.success("Contact removed");
  };

  // Play siren sound when SOS triggered
  const playSirenSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Siren pattern: alternating frequencies
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.25);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.5);
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.75);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 1.0);

      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1.2);

      // Repeat siren 3 times
      setTimeout(() => playSirenSound(), 1500);
      setTimeout(() => playSirenSound(), 3000);
    } catch (e) {
      console.log("Audio not supported:", e);
    }
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!readyForSOS || !confirmSendAll()) {
      toast.error("Please login, grant location, and select contacts");
      return;
    }

    // Generate location link
    const locationLink = `https://www.google.com/maps?q=${lat},${long}`;

    const useSelected = selectedContactIds.length > 0;
    const endpoint = useSelected ? '/api/v1/emergency/send-sos-selected' : '/api/v1/emergency/emergencypressed';
    const body = useSelected
      ? { userId: auth.user._id, selectedContactIds, lat, long, locationLink }
      : { userId: auth.user._id, lat, long, locationLink };

    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/emergency${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(`🚨 SOS SUCCESS! Sent to ${data.contactsNotified || data.contactsNotified || 1} ${useSelected ? 'selected' : 'all'} contact(s)`);
        toast.success(`📍 Location Link: ${locationLink}`);
        if (data.smsResults) {
          data.smsResults.forEach(result => {
            toast(result.success ? `✅ SMS to ${result.name}` : `⚠️ SMS failed: ${result.name}`);
          });
        }
        setIsButtonDisabled(true);
        setSelectedContactIds([]); // Clear selection
      } else {
        toast.error(data.message || `SOS FAILED: ${res.status}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Network error - Check backend server");
    }
  };

  // Unified SOS trigger with siren sound
  const triggerPoliceSirenSOS = useCallback(async () => {
    if (!readyForSOS || isButtonDisabled) return;

    setSosTriggered(true);
    playSirenSound(); // Play siren sound
    await handleSubmit(); // Notify backend
  }, [readyForSOS, isButtonDisabled, playSirenSound, handleSubmit]);

  // Handle voice triggered SOS
  const handleVoiceSOS = useCallback(() => {
    if (readyForSOS && !isButtonDisabled) {
      console.log("🚨 Triggering SOS via voice!");
      setSosTriggered(true);
      playSirenSound(); // Play siren sound
      handleSubmit();
      // Stop listening after trigger
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setVoiceEnabled(false);
      setIsListening(false);
    }
  }, [readyForSOS, isButtonDisabled, playSirenSound, handleSubmit]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join("")
          .toLowerCase();

        console.log("🎤 Voice detected:", transcript);

        // Check for trigger words
        if (transcript.includes("help") || transcript.includes("sos") || transcript.includes("emergency")) {
          console.log("🚨 VOICE TRIGGER DETECTED!");
          handleVoiceSOS();
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("🎤 Speech recognition error:", event.error);
      };

      recognitionRef.current.onend = () => {
        // Restart if still enabled
        if (voiceEnabled && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.log("Auto-restart error:", e);
          }
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [voiceEnabled]);

  // Toggle voice listening
  const toggleVoiceListening = () => {
    if (!voiceEnabled) {
      // Start listening
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setVoiceEnabled(true);
          setIsListening(true);
          toast.success("🎤 Voice activated! Say 'HELP' to trigger SOS");
        } catch (e) {
          console.error("Start error:", e);
          toast.error("Could not start voice recognition");
        }
      } else {
        toast.error("Voice recognition not supported in this browser");
      }
    } else {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setVoiceEnabled(false);
      setIsListening(false);
      toast.success("🎤 Voice deactivated");
    }
  };

  const sendMessage = async () => {
    try {
      console.log('📱 Test SMS from frontend');
      const response = await fetch(
        "http://localhost:5000/api/v1/emergency/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: "+919771385727",
            message: "🚨 Emergency Help Needed! 📱 Test via TextBee/Mock",
          }),
        }
      );

      const data = await response.json();

      console.log("Backend SMS response:", data);

      if (!response.ok) {
        throw new Error(data.message || "SMS failed");
      }

      toast.success(data.message || "SMS Sent Successfully 📱");
    } catch (error) {
      console.error("Test SMS error:", error);
      toast.error(error.message);
    }
  };

  const showPosition = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLat(latitude);
    setLong(longitude);
    fetchNearbyHelp(latitude, longitude);
  };

  const getLocation = useCallback(async (retry = false) => {
    // Try IP geolocation fallback first if no browser geo
    if (!navigator.geolocation) {
      toast.info('Using IP geolocation fallback...');
      return getIPLocation();
    }

    const options = {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(
      showPosition,
      (error) => {
        console.error('Geolocation error:', error);
        let errorMsg = 'Location access failed';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location permission denied. Enable in browser/site settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'GPS unavailable. Using IP fallback...';
            getIPLocation();
            return;
          case error.TIMEOUT:
            errorMsg = 'GPS timeout. Using IP fallback...';
            if (retry) errorMsg += ' (retries exhausted)';
            else setTimeout(() => getLocation(true), 2000);
            getIPLocation();
            return;
          default:
            errorMsg = 'GPS error. Using IP fallback.';
        }

        toast.error(errorMsg);
        // Fallback to IP always on error
        getIPLocation();
      },
      options
    );
  }, []);

  const getIPLocation = useCallback(async () => {
    try {
      toast.loading('Getting approximate location via IP...', { id: 'ipgeo' });
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();

      if (data.error) throw new Error('IP service error');

      const { latitude: lat, longitude: lng } = data;
      setLat(lat);
      setLong(lng);
      toast.success(`📍 IP Location: Delhi area approx (${lat.toFixed(4)}, ${lng.toFixed(4)})`, { id: 'ipgeo' });
      fetchNearbyHelp(lat, lng);
    } catch (err) {
      console.error('IP geo failed:', err);
      // Hard fallback Delhi coords
      const fallbackLat = 28.6139;
      const fallbackLng = 77.2090;
      setLat(fallbackLat);
      setLong(fallbackLng);
      toast.error(`All geo failed. Using Delhi fallback. Enable GPS for accuracy.`, { id: 'ipgeo' });
      fetchNearbyHelp(fallbackLat, fallbackLng);
    }
  }, []);

  const fetchNearbyHelp = async (lat, lng) => {
    setLoadingNearby(true);
    try {
      const res = await fetch(`http://localhost:5000/api/v1/emergency/nearby-help`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lat, lng })
      });
      const data = await res.json();

      if (data.success) {
        setNearbyData(data);
        toast.success(`✅ Found ${data.count || 0} emergency services nearby`);
      } else {
        toast.error('Nearby help unavailable');
        setNearbyData({});
      }
    } catch (error) {
      console.error('Nearby help error:', error);
      toast.error('Backend connection failed');
      setNearbyData({});
    } finally {
      setLoadingNearby(false);
    }
  };

  // Share location via WhatsApp
  const shareViaWhatsApp = () => {
    if (!lat || !long) {
      toast.error("Please enable location access first");
      return;
    }

    const locationLink = `https://www.google.com/maps?q=${lat},${long}`;
    const message = `🚨 EMERGENCY ALERT!\nI need help immediately.\n\nMy Live Location:\n${locationLink}`;

    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
    toast.success("WhatsApp opened with location!");
  };

  // Share location via SMS
  const shareViaSMS = () => {
    if (!lat || !long) {
      toast.error("Please enable location access first");
      return;
    }

    const locationLink = `https://www.google.com/maps?q=${lat},${long}`;
    const message = `🚨 EMERGENCY ALERT!\nI need help immediately.\n\nMy Live Location:\n${locationLink}`;

    window.location.href = `sms:?body=${encodeURIComponent(message)}`;
    toast.success("SMS app opened with location!");
  };

  // Share location directly (Google Maps)
  const shareLocation = () => {
    if (!lat || !long) {
      toast.error("Please enable location access first");
      return;
    }

    const locationLink = `https://www.google.com/maps?q=${lat},${long}`;

    // Copy to clipboard
    navigator.clipboard.writeText(locationLink).then(() => {
      toast.success("📍 Location link copied to clipboard!");
      alert(`Location Shared:\n${locationLink}`);
    }).catch(() => {
      toast.error("Failed to copy location");
    });
  };

  const getPlacesByTab = () => {
    const allPlaces = nearbyData.allPlaces || [];
    switch (activeTab) {
      case 'police': return nearbyData.nearestPolice || [];
      case 'hospitals': return nearbyData.hospitals || [];
      case 'fire': return nearbyData.fireStations || [];
      default: return allPlaces;
    }
  };

  const places = getPlacesByTab();

  useEffect(() => {
    getLocation();
    window.scrollTo(0, 0);
  }, [getLocation]);

  return (
    <>
      <Navbar />
      <div className="heightRes">
        <section className="banner_wrapper">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-12 my-5 my-md-0 text-center text-md-start">
                <p className="banner-subtitle" style={{ textAlign: "center" }}>
                  Your Safety our Priority
                </p>
                <h1 className="banner-title mb-5" style={{ textAlign: "center" }}>
                  Help us bring <span>Women Safety</span> to Reality with us
                </h1>
                <center>
                  <button
                    className="button-30 text-center"
                    onClick={handleSubmit}
                    disabled={!readyForSOS || isButtonDisabled}
                    style={{
                      opacity: readyForSOS ? 1 : 0.6,
                      cursor: readyForSOS ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <PiSirenBold size={200} className="text-white" />
                  </button>
                </center>

                {/* Voice Activation Button */}
                <center style={{ marginTop: '20px' }}>
                  <button
                    className={`btn ${voiceEnabled ? 'btn-danger' : 'btn-outline-primary'}`}
                    onClick={toggleVoiceListening}
                    style={{ fontSize: '18px', padding: '10px 20px', marginRight: '10px' }}
                  >
                    {isListening ? <><FaMicrophone className="me-2" />Listening... Say "HELP"!</> : <><FaMicrophoneSlash className="me-2" />Enable Voice Control</>}
                  </button>

                  {/* Test SMS Button */}
                  <button
                    className="btn btn-info"
                    onClick={sendMessage}
                    style={{ fontSize: '18px', padding: '10px 20px', marginLeft: '10px' }}
                  >
                    📱 Test SMS
                  </button>

                  {/* Police Siren Button */}
                  <button
                    className="btn btn-warning"
                    onClick={triggerPoliceSirenSOS}
                    disabled={!readyForSOS || isButtonDisabled}
                    style={{ fontSize: '18px', padding: '10px 20px', marginLeft: '10px' }}
                  >
                    🚨 Police Siren
                  </button>
                </center>

                {/* Location Sharing Buttons */}
                <center style={{ marginTop: '20px' }}>
                  <button
                    className="btn btn-success"
                    onClick={shareLocation}
                    disabled={!lat || !long}
                    style={{ fontSize: '16px', padding: '10px 20px', marginRight: '10px' }}
                  >
                    📍 Share Location
                  </button>

                  <button
                    className="btn btn-success"
                    onClick={shareViaWhatsApp}
                    disabled={!lat || !long}
                    style={{ fontSize: '16px', padding: '10px 20px', marginRight: '10px' }}
                  >
                    💬 WhatsApp
                  </button>

                  <button
                    className="btn btn-info"
                    onClick={shareViaSMS}
                    disabled={!lat || !long}
                    style={{ fontSize: '16px', padding: '10px 20px' }}
                  >
                    📲 SMS
                  </button>
                </center>
              </div>
            </div>
          </div>

          {/* Emergency Contacts Manager */}
          <div className="container my-4">
            <div className="row">
              <div className="col-md-8 mx-auto">
                <EmergencyContactsManager onSelectionChange={setSelectedContactIds} />
              </div>
            </div>
          </div>

          {/* Local Contact List Section */}
          <div className="container my-4">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card shadow-sm mb-4">
                  <div className="card-header bg-secondary text-white">
                    <h5 className="mb-0">Save a Phone Number</h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSaveContact}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Contact name"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            placeholder="+91xxxxxxxxxx"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="mt-3 text-end">
                        <button type="submit" className="btn btn-primary">
                          Save Contact
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {savedContacts.length > 0 && (
                  <div className="card shadow-sm">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">Saved Phone Numbers</h6>
                    </div>
                    <div className="card-body">
                      <div className="list-group">
                        {savedContacts.map((contact) => (
                          <div key={contact.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{contact.name}</strong>
                              <p className="mb-0 small text-muted">{contact.phone}</p>
                            </div>
                            <div className="btn-group">
                              <a href={`tel:${contact.phone}`} className="btn btn-sm btn-success">
                                Call
                              </a>
                              <button
                                className="btn btn-sm btn-danger"
                                type="button"
                                onClick={() => handleRemoveLocalContact(contact.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {lat && long && (
            <div className="container my-5">
              <div className="row mb-4">
                <div className="col-12 text-center">
                  <h3>📍 Your Location: {lat.toFixed(4)}, {long.toFixed(4)}</h3>
                  <p className="text-muted">
                    {loadingNearby ? "🔄 Finding nearby help..." : nearbyData.count ? `✅ ${nearbyData.count} services found` : "No services found"}
                  </p>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-12">
                  <EmergencyMap lat={lat} lng={long} nearbyHelp={nearbyData.allPlaces || []} />
                </div>
              </div>

              {nearbyData.count > 0 && (
                <>
                  <div className="row mb-3">
                    <div className="col-12">
                      <div className="nav nav-tabs justify-content-center" role="tablist">
                        <button
                          className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                          onClick={() => setActiveTab('all')}
                        >
                          All ({nearbyData.count || 0})
                        </button>
                        <button
                          className={`nav-link ${activeTab === 'police' ? 'active' : ''}`}
                          onClick={() => setActiveTab('police')}
                        >
                          <FaShieldAlt /> Police ({nearbyData.nearestPolice?.length || 0})
                        </button>
                        <button
                          className={`nav-link ${activeTab === 'hospitals' ? 'active' : ''}`}
                          onClick={() => setActiveTab('hospitals')}
                        >
                          <FaHospital /> Hospitals ({nearbyData.hospitals?.length || 0})
                        </button>
                        <button
                          className={`nav-link ${activeTab === 'fire' ? 'active' : ''}`}
                          onClick={() => setActiveTab('fire')}
                        >
                          <FaFireAlt /> Fire ({nearbyData.fireStations?.length || 0})
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {places.slice(0, 6).map((place, i) => (
                      <div key={i} className="col-md-4 col-sm-6 mb-3">
                        <div className="card h-100 shadow-sm">
                          <div className="card-body">
                            <h6 className="card-title">
                              {place.type === 'police' && <FaShieldAlt className="text-danger me-1" />}
                              {place.type === 'hospital' && <FaHospital className="text-primary me-1" />}
                              {place.type === 'fire_station' && <FaFireAlt className="text-warning me-1" />}
                              {place.name}
                            </h6>
                            <p className="small text-muted mb-2">
                              📍 {place.lat?.toFixed(4)}, {place.lon?.toFixed(4)}
                            </p>
                            {place.address && <p className="small">{place.address}</p>}
                            <a
                              href={`https://maps.google.com/?q=${place.lat},${place.lon}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary me-1"
                            >
                              Directions
                            </a>
                            <a
                              href={`tel:${place.phone || '100'}`}
                              className="btn btn-sm btn-success"
                            >
                              <FaPhone /> Call
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                    {places.length === 0 && (
                      <div className="col-12 text-center py-4">
                        <p className="text-muted">No {activeTab} services found nearby</p>
                        <p>Dial <strong>100</strong> for Police Emergency</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      </div>
      <Parallelx />
      <Footer />
    </>
  );
};

export default Emergency;
