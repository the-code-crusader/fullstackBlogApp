import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Delete from "../img/del.svg";
import Edit from "../img/edit.svg";
import Menu from "../components/Menu";
import Blank from "../img/blankpfp.jpg";
import { AuthContext } from "./../context/authContext";
import axios from "axios";
import moment from "moment";
import DOMPurify from "dompurify";

const Account = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState(currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [usernameChanged, setusernameChanged] = useState(false);
  const [emailChanged, setemailChanged] = useState(false);

  useEffect(() => {
    setusernameChanged(username !== currentUser.username);
  }, [username, currentUser.username]);

  useEffect(() => {
    setemailChanged(email !== currentUser.email);
  }, [email, currentUser.email]);

  const [err, setErr] = useState(null);

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const handleUsernameChange = async (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailChanged && !usernameChanged) {
      try {
        const res2 = await axios.put(
          `/api/auth/update/email/${currentUser.id}`,
          { email: email }
        );
        navigate("/login");
      } catch (error) {
        console.log(error);
        setErr(error.response.data);
      }
    } else if (usernameChanged && !emailChanged) {
      try {
        const res = await axios.put(
          `/api/auth/update/username/${currentUser.id}`,
          { username: username }
        );
        navigate("/login");
      } catch (error) {
        console.log(error);
        setErr(error.response.data);
      }
    } else if (usernameChanged && emailChanged) {
      try {
        const res = await axios.put(
          `/api/auth/update/username/${currentUser.id}`,
          { username: username }
        );
        const res2 = await axios.put(
          `/api/auth/update/email/${currentUser.id}`,
          { email: email }
        );
        navigate("/login");
      } catch (error) {
        console.log(error);
        setErr(error.response.data);
      }
    } else {
      return;
    }
  };

  return (
    <div className="updateAcc">
      <h2>Account Page</h2>
      <h6>You will be forced to login again after updating</h6>
      <form>
        <input
          required
          name="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          autocomplete="off"
        />
        <input
          required
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          autocomplete="off"
        />
        <button onClick={handleSubmit} className="butt">
          Update
        </button>
      </form>
      {err && <p>{err}</p>}
    </div>
  );
};

export default Account;
