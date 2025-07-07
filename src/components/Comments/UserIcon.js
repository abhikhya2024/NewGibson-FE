import { useEffect, useState } from "react";
import axios from "axios";
const UserIcon = (props) => {
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
  useEffect(()=> {
    fetchUsers()
  },[])
  return (
    <ul>
      {users.map((item) => (
        <li key={item.id}>{item.email}</li>
      ))}
    </ul>
  );
};

export default UserIcon;
