import { useState } from "react";
import { FaCommentDots } from "react-icons/fa";
import axios from "axios";
const Comments = (props) => {
  const {color} = props
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      // 🔹 Fetch all testimonies (no witness filter)
      const res = await axios.get(`http://localhost:8000/api/users/`);
      setUsers(res.data.results);
      // 🔹 Fetch testimonies for selected witnesses
    } catch (err) {
      console.error("Failed to fetch testimonies:", err);
    }
  };
  return (
    <button
      // onClick={() => handleOpenDrawer(qa.id)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "24px",
        color: color,
      }}
      title="Add/View Comments"
    >
      <FaCommentDots />
    </button>
  );
};

export default Comments;
