import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2, Eye, EyeOff } from "lucide-react";
import secure from "../assets/DLP-Logo.png";
// import hub from "../assets/security_hub_superfast.html";
import LoginBackground from "../assets/DashboardBackground.png";
import feature from "../assets/Network-Protection.gif";
import Footer from "../assets/Footer.png";
import DashboardBackground from "../assets/DashboardBackground.png";
import SecurityAnimation from "./SecurityAnimation";
// import { loginApi } from "../api/authApi";



const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();  // Get login directly
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log(" Attempting login with:", username);

    try {
      const result = await login(username, password);
      console.log(" Login result:", result);

      // Check if login was successful
      if (result.success) {
        console.log(" Login successful, navigating to dashboard");
        navigate("/dashboard/mainDashboard", { replace: true });
      } else {
        console.log(" Login failed:", result.message);
        setError(result.message || "Invalid username or password");
        // Only clear on error
        setUsername("");
        setPassword("");
      }
    } catch (err) {
      console.error(" Login error:", err);
      setError(err.message || "An error occurred during login");
      setUsername("");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

       
        .login-wrapper {
  height: 100vh;
  width: 100%;
  background: url(${LoginBackground}) center center / cover no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
  overflow: hidden;
}

        .login-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 900px;
          height: auto;
          background-color: #041432;
          border: 1px solid rgba(74, 144, 217, 0.1);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.9);
        }

        .login-card {
          display: flex;
          flex-direction: row;
          flex: 1;
          min-height: 480px;
        }

        .login-left-panel {
          flex: 0 0 48%;
          padding: 36px 36px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          // border-right: 1px solid rgba(74, 144, 217, 0.08);
          overflow: hidden;
        }


        .login-logo {
          width: 200px;
          object-fit: contain;
          margin-bottom: 16px;
          margin-left: auto;
          margin-right: auto;
        }

        .login-heading {
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 18px;
          text-align: center;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-group {
        width: 85%;
        margin: 0 auto;
        }

        .form-label {
          color: #c0d2e5;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.3px;
        }

        .login-input {
          width: 100%;
          padding: 9px 13px;
          background-color: #051320;
          border: 1px solid #1a3f5f;
          border-radius: 6px;
          color: #e0ecff;
          font-size: 12px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .login-input:focus {
          border-color: #3d7bc4;
          box-shadow: 0 0 0 2px rgba(61, 123, 196, 0.15);
        }

        .login-input::placeholder {
          color: #5a7a9f;
        }

        .password-wrapper {
          width: 100%;
          position: relative;
        }

        .password-toggle-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .forgot-link {
          color: #5ba3f0;
          font-size: 12px;
          text-decoration: none;
          margin-top: -2px;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .error-message {
          color: #f87171;
          font-size: 13px;
          text-align: center;
          margin: 0;
        }

        .sign-btn {
          width: 100%;
          padding: 10px;
          background-color: #1a5a9c;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background-color 0.2s;
          letter-spacing: 0.3px;
          margin-top: 4px;
        }

        .sign-btn:hover:not(:disabled) {
          background-color: #14488a;
        }

        .sign-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        

        @media (max-width: 768px) {
          .login-wrapper {
            padding: 16px;
            justify-content: flex-start;
            padding-top: 40px;
          }
          .login-card {
            flex-direction: column;
            min-height: auto;
          }
          .login-left-panel {
            flex: 0 0 auto;
            padding: 36px 28px;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }
          .login-right-panel {
            min-height: 250px;
            padding: 20px;
          }
          .login-right-image {
            max-height: 250px;
          }
          .login-logo {
            width: 160px;
            margin-bottom: 20px;
          }
          .login-heading {
            font-size: 22px;
            margin-bottom: 16px;
            text-align: center;
          }
          .login-form {
            gap: 12px;
          }
        }

.login-right-panel {
  flex: 1.4;          /* makes right side bigger */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: transparent; /* removes square background */
}

.login-right-image {
  width: 100%;
  max-width: 650px;
  height: auto;
  object-fit: contain;
}

        @media (max-width: 480px) {
          .login-wrapper {
            padding: 12px;
            padding-top: 20px;
          }
          .login-container {
            border-radius: 10px;
          }
          .login-left-panel {
            padding: 28px 20px;
          }
          .login-logo {
            width: 140px;
            margin-bottom: 16px;
          }
          .login-heading {
            font-size: 20px;
            margin-bottom: 14px;
            text-align: center;
          }
          .form-label {
            font-size: 12px;
          }
          .login-input {
            padding: 9px 12px;
            font-size: 13px;
          }
          .sign-btn {
            font-size: 14px;
            padding: 10px;
          }
          .login-right-panel {
            display: none;
          }
       
          
        }
        .login-footer {
  background-color: #191818;
  border-top: 1px solid rgba(74, 144, 217, 0.08);
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-image {
  width: 100%;
  display: block;
  object-fit: contain;
}


      `}</style>

      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-card">
            <div className="login-left-panel">
              <img
                src={secure}
                alt="SecureIT"
                className="login-logo"
              />

              <h2 className="login-heading">Login</h2>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label className="form-label">User</label>
                  <input
                    className="login-input"
                    type="text"
                    placeholder="username@gmail.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="password-wrapper">
                    <input
                      className="login-input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ paddingRight: "42px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle-btn"
                    >
                      {showPassword
                        ? <Eye size={15} color="#5a80a8" />
                        : <EyeOff size={15} color="#5a80a8" />}
                    </button>

                   
                  </div>
                        
                        <a href="#" className="forgot-link">Forgot Password?</a>
                        <br></br>
                        <br></br>

                {error && (
                  <p className="error-message">{error}</p>
                )}

                <button type="submit" disabled={isLoading} className="sign-btn">
                  {isLoading && <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />}
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>

                </div>

                
              </form>
            </div>

            <div className="login-right-panel">
              <img
                src={feature}
                alt="Network-Protection.gif"
                className="login-right-image"
              />

              <SecurityAnimation></SecurityAnimation>
            </div>
          </div>

          <div className="login-footer">
            <img
              src={Footer}
              alt="Footer"
              className="footer-image"
            />
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;