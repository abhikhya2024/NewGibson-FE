import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaApple, FaEnvelope, FaLock } from 'react-icons/fa';
import "../../assets/css/loginpage.css"
import { TiVendorMicrosoft } from "react-icons/ti";

const Login = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).then((response) => {
      console.log("✅ Login Success", response);
      navigate("/testimony");
    }).catch(error => {
      console.error("❌ Login Failed", error);
    });
  };

  return (
    // <div>
    //   <h2>Login</h2>
    //   <button onClick={handleLogin}>Login with Microsoft</button>
    // </div>
     <div className="login-bg d-flex justify-content-center align-items-center vh-100 position-relative">
      <div className="login-card shadow rounded-4 d-flex position-relative">
        <div className='design-dot-1'></div>

        {/* Left Image Section */}
        <div className="login-left d-md-flex d-none flex-column justify-content-center align-items-center p-4">

          <h1 className="login-title mb-2">
            <img src="https://media.legaltechnologyhub.com/CC_FC_logo_0522_01_0a716b0871.png" alt="Cloud court" className='img-fluid'/>
          </h1>
        </div>

        {/* Right Form Section */}
        <div className="login-right bg-white p-4 d-flex flex-column justify-content-center" style={{ minWidth: '320px' }}>
          <h1 className="login-title d-md-none mb-2">
            <img src="https://media.legaltechnologyhub.com/CC_FC_logo_0522_01_0a716b0871.png" alt="Cloud court" className='img-fluid'/>
          </h1>
          <h2 className="login-title-right text-center mb-0">Welcome</h2>
          <small className="login-subtitle-right text-center">Login with Email</small>

          <form className='mt-4'>
            <div className="form-group mb-3 position-relative">
                <label htmlFor="email" className='label-sorath'>Email</label>
              <FaEnvelope className="form-icon" />
              <input type="email" className="form-control sorath-input-text ps-5 p-10" placeholder="Email id" />
            </div>

            <div className="form-group position-relative">
                <label htmlFor="password" className='label-sorath'>Password</label>
              <FaLock className="form-icon" />
              <input type="password" className="form-control sorath-input-text ps-5 p-10" placeholder="Password" />
            </div>
            <div className="text-end mb-3">
          <small className="login-subtitle-right">Forgot your password?</small>
            </div>
            <button type="submit" className="login-btn-sorath mb-3">LOGIN</button>
          </form>

          <div className="text-center mb-3 position-relative d-flex or-line-with">
            <span>OR</span>
            <hr className='or-line' />
          </div>
          <div className="d-flex justify-content-between gap-2 mb-4">
            <button className="btn btn-outline-secondary w-100 fs-5"><FaGoogle /></button>
            <button className="btn btn-outline-secondary w-100 fs-5" onClick={handleLogin}><TiVendorMicrosoft/></button>
            <button className="btn btn-outline-secondary w-100 fs-5"><FaApple /></button>
          </div>

          <div className="register-text text-center">
            <p className='mb-0'>Don't have an account? <a href="#">Register Now</a></p>
          </div>
        </div>
        <div className='design-dot-2'></div>
      </div>
        
    </div>
  );
};

export default Login;
