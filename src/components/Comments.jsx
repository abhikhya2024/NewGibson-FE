import React, { useState, useEffect } from "react";
import { Offcanvas, Form, Dropdown, Button } from "react-bootstrap";
import { Sliders } from "react-bootstrap-icons";
import BASE_URL from "../api";
import { useMsalUser } from "../msal";
import axios from "axios";

const Comments = ({ showComments, handleClose, testimonyId }) => {
  const { name, email, msal_id } = useMsalUser();
  const [content, setContent] = useState("");
  const [comments, setComments ] = useState([]);
  const [ userId, setUserId ] = useState();
  const mockMentions = ["Alice", "Bob", "Charlie", "Hardik"];
  const [showMentionList, setShowMentionList] = useState(false);

  const getUserId = async () => {
    try {
        const res = await axios.post(
        `${process.env.REACT_APP_PROD_API_URL}/api/users/get-user-id/`,
        { msal_id: msal_id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      console.log("usersssss", res);

        setUserId(res.data.id)

    } catch (err) {
      console.error(err.message);
    }
  };
useEffect(() => {
  if (showComments && msal_id) {
    getUserId();
    fetchComments()

  }
}, [showComments, msal_id]);
  const postComment = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_PROD_API_URL}/api/comments/`,
        { user: userId, content: content, testimony: testimonyId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("commentss", res);
    } catch (err) {
      console.error("API error:", err.response?.data || err.message);
    }
  };

    const fetchComments = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_PROD_API_URL}/api/comments/by-testimony/${testimonyId}`
      );
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      console.log("comments", data.comments)
      setComments(data.comments);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getColorForUser = (userId) => {
  const colors = [
    "#6c757d", "#007bff", "#17a2b8", "#28a745", "#ffc107",
    "#dc3545", "#6610f2", "#fd7e14", "#20c997"
  ];
  return colors[userId % colors.length];
};

// Extract initials from email
  function getInitials(name) {
    if (!name) return "";

    const words = name.trim().split(/\s+/); // Split by any amount of whitespace

    const firstInitial = words[0]?.[0] || "";
    const secondInitial = words[1]?.[0] || "";

    return (firstInitial + secondInitial).toUpperCase();
  }
  return (
    <Offcanvas show={showComments} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="fw-semibold">
          <Sliders className="me-2" />
          Comments
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="bg-light">
        <div className="bg-white p-3 rounded-3 shadow-sm">
          {/* Witness Type */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Add comment</Form.Label>
            <div className="d-flex flex-wrap gap-3 ps-1">
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Write your comment here and mention others with @..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </Form.Group>
          <Button
            variant="primary"
            onClick={postComment}
            style={{ float: "right" }}
          >
            Create
          </Button>
          <br />
<Form.Group className="mb-4">
  <Form.Label className="fw-semibold">Previous Comments</Form.Label>

  {comments.map((row, idx) => (
    <div
      key={row.id || idx}
      className="d-flex align-items-start gap-3 ps-1 mb-3"
    >
      {/* Circular initials */}
      <div
        className="rounded-circle text-white d-flex align-items-center justify-content-center fw-semibold"
        style={{
          width: "32px",
          height: "32px",
          backgroundColor: getColorForUser(row.user),
          flexShrink: 0,
          fontSize: "0.9rem",
        }}
      >
        {getInitials(row.name)}
      </div>

      {/* Comment text (read-only) */}
      <Form.Control
        as="textarea"
        rows={2}
        readOnly
        value={row.content}
        className="flex-grow-1"
        style={{
          resize: "none",
          backgroundColor: "#f8f9fa",
          borderColor: "#ced4da",
        }}
      />
    </div>
  ))}
</Form.Group>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Comments;
