import React, { useState, useEffect } from "react";
import {
  Offcanvas,
  Button,
  Form,
  ListGroup,
  InputGroup,
  Modal,
} from "react-bootstrap";
import {
  FiPaperclip,
  FiThumbsUp,
  FiSend,
  FiEdit,
  FiTrash2,
  FiMessageCircle,
  FiAtSign,
} from "react-icons/fi";
import { useMsalUser } from "../msal";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const mockMentions = ["Alice", "Bob", "Charlie", "Hardik"];

const CommentSidebar = ({ showComments, handleClose, testimonyId }) => {
  const [newComment, setNewComment] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [replyFormOpenId, setReplyFormOpenId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");

  const { name, email, msal_id } = useMsalUser();
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [userId, setUserId] = useState();
  const mockMentions = ["Alice", "Bob", "Charlie", "Hardik"];
  const [showMentionList, setShowMentionList] = useState(false);
  console.log("user details", email, name);
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
      );
      console.log("usersssss", res);

      setUserId(res.data.id);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    if (showComments && msal_id) {
      getUserId();
      fetchComments();
    }
  }, [showComments, msal_id]);
  const postComment = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_PROD_API_URL}/api/comments/`,
        {
          user: userId,
          content: newComment,
          testimony: testimonyId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Show success toast
      toast.success("Comment posted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      return res; // so handleCommentSubmit can use the returned comment
    } catch (error) {
      // Show error toast
      toast.error("Failed to post comment", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error(error);
      throw error;
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_PROD_API_URL}/api/comments/by-testimony/${testimonyId}`
      );
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      console.log("comments data", data.comments);
      setComments(data.comments);
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteComments = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_PROD_API_URL}/api/comments/${id}/`
      );

      toast.success("Comment deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      await fetchComments(); // refresh full list from server
    } catch (err) {
      console.error("❌ Failed to delete comment:", err.message);
      toast.error("Failed to delete comment!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

const updateComment = async (commentId) => {
  try {
    const res = await axios.put(`${process.env.REACT_APP_PROD_API_URL}/api/comments/${commentId}/`, 
      {
  user: userId,
  content: editedText,
  testimony: testimonyId
}
    );


    toast.success("Comment updated successfully"); // ✅ Show toast

    setEditingCommentId(null); // ✅ Hide textarea
    setEditedText("");         // ✅ Clear text
    fetchComments();           // ✅ Refresh comments list
  } catch (error) {
    toast.error("Error updating comment");
    console.error(error);
  }
};
  const getColorForUser = (userId) => {
    const colors = [
      "#6c757d",
      "#007bff",
      "#17a2b8",
      "#28a745",
      "#ffc107",
      "#dc3545",
      "#6610f2",
      "#fd7e14",
      "#20c997",
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
  const handleCommentSubmit = async (parentId = null) => {
    if (!newComment.trim()) return;

    try {
      // Call API and get back the saved comment
      const res = await postComment();

      // If postComment returns the saved comment
      const savedComment = res.data; // adjust based on your API response
      console.log("✅ Saved comment:", savedComment);

      if (parentId) {
        // Add as a reply
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: [...c.replies, savedComment] }
              : c
          )
        );
      } else {
        // Add to top of comments list
        setComments((prev) => [savedComment, ...prev]);
      }

      // Reset form fields
      setNewComment("");
      setAttachments([]);
      setShowMentionList(false);
      setReplyFormOpenId(null);
    } catch (err) {
      console.error("❌ Failed to submit comment:", err);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const preview = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setAttachments(preview);
  };

  const handleDelete = (id) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleEdit = (id, newText) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, text: newText } : c))
    );
  };

  const initials = getInitials(name);

  function getInitials(name) {
    if (!name) return "";
    const words = name.trim().split(/\s+/); // Split by any amount of whitespace
    const firstInitial = words[0]?.[0] || "";
    const secondInitial = words[1]?.[0] || "";
    return (firstInitial + secondInitial).toUpperCase();
  }

  const renderComment = (comment) => (
    <ListGroup.Item key={comment.id} className="mb-2">
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <div
            className="user-image-box"
            style={{
              backgroundImage: 'url("https://i.pravatar.cc/150?img=4")',
            }}
            title={name}
          ></div>

          <div className="">
            <p className="mb-0">{comment.name}</p>
            <small className="text-muted">{comment.time}</small>
          </div>
        </div>

        <div>
          <Button
            variant="link"
            className="p-1"
            onClick={() => {
              setCommentToDelete(comment.id);
              setShowDeleteModal(true);
            }}
          >
            <FiTrash2 />
          </Button>
<Button
  variant="link"
  className="p-1"
  onClick={() => {
    setEditingCommentId(comment.id);
    setEditedText(comment.content); // load existing text into textbox
  }}
>
  <FiEdit />
</Button>
        </div>
      </div>
      <div className="mt-1">
        {editingCommentId === comment.id ? (
          <div>
            <Form.Control
              as="textarea"
              rows={2}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
            <div className="mt-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => updateComment(comment.id)}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="ms-2"
                onClick={() => setEditingCommentId(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          comment.content
        )}
      </div>
      {/* {comment.attachments.length > 0 && (
                <div className="mt-2">
                    {comment.attachments.map(file => (
                        <img
                            key={file.name}
                            src={file.url}
                            alt={file.name}
                            width="80"
                            className="me-2 rounded"
                        />
                    ))}
                </div>
            )} */}

      <div className="d-flex gap-3 mt-2">
        <Button variant="link" size="sm" className="p-0 text-primary">
          <FiThumbsUp /> Like
        </Button>
        <Button
          variant="link"
          size="sm"
          className="p-0 text-primary"
          onClick={() =>
            setReplyFormOpenId(
              replyFormOpenId === comment.id ? null : comment.id
            )
          }
        >
          <FiMessageCircle /> Reply
        </Button>
      </div>

      {/* {replyFormOpenId === comment.id && (
                <div className="mt-2 ms-3">
                    <Form.Group className="mb-2">
                        <Form.Control
                            as="textarea"
                            rows={2}
                            value={content}
                            placeholder="Write a reply..."
                            onChange={e => setContent(e.target.value)}
                        />
                    </Form.Group>
                    <div className="d-flex align-items-center gap-2">
                        <Button
                            size="sm"
                            variant="light"
                            onClick={() => setShowMentionList(true)}
                        >
                            <FiAtSign /> Mention
                        </Button>
                        <Form.Label className="mb-0">
                            <FiPaperclip />
                            <Form.Control
                                type="file"
                                hidden
                                multiple
                                onChange={handleFileChange}
                            />
                        </Form.Label>
                        <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleCommentSubmit(comment.id)}
                        >
                            <FiSend />
                        </Button>
                    </div>
                </div>
            )} */}

      {/* {comment.replies.length > 0 && (
                <ListGroup className="mt-2 ms-3">
                    {comment.replies.map(reply => renderComment(reply))}
                </ListGroup>
            )} */}
    </ListGroup.Item>
  );

  return (
    <Offcanvas show={showComments} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Comments</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                await deleteComments(commentToDelete);
                setShowDeleteModal(false);
              }}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
        <ListGroup className="mb-4">
          {Array.isArray(comments) &&
            comments.map((comment) => renderComment(comment))}
        </ListGroup>

        <div className="comment-input-area border rounded p-3">
          <Form.Group className="mb-2">
            <Form.Control
              as="textarea"
              rows={3}
              value={newComment}
              placeholder="Write an update and mention others with @"
              onChange={(e) => setNewComment(e.target.value)}
            />
          </Form.Group>

          {attachments.length > 0 && (
            <div className="mb-2 d-flex flex-wrap gap-2">
              {attachments.map((file) => (
                <img
                  key={file.name}
                  src={file.url}
                  alt={file.name}
                  width="80"
                  className="rounded"
                />
              ))}
            </div>
          )}

          {showMentionList && (
            <ListGroup
              className="mb-2 shadow-sm"
              style={{ maxHeight: 150, overflowY: "auto" }}
            >
              {mockMentions.map((mention, idx) => (
                <ListGroup.Item
                  key={idx}
                  action
                  onClick={() => {
                    setNewComment((prev) => prev + `@${mention} `);
                    setShowMentionList(false);
                  }}
                >
                  @{mention}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          <div className="d-flex align-items-center gap-3">
            <Button
              size="sm"
              variant="light"
              onClick={() => setShowMentionList(true)}
            >
              <FiAtSign /> Mention
            </Button>

            <Form.Label className="mb-0">
              <FiPaperclip />
              <Form.Control
                type="file"
                hidden
                multiple
                onChange={handleFileChange}
              />
            </Form.Label>

            <Button
              size="sm"
              variant="primary"
              onClick={() => handleCommentSubmit()}
            >
              Create
              <FiSend />
            </Button>
          </div>
        </div>
      </Offcanvas.Body>
      <ToastContainer />
    </Offcanvas>
  );
};

export default CommentSidebar;
