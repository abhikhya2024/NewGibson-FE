import {
  Container,
  Row,
  Col,
  Card,
  Breadcrumb,
  Dropdown,
  ProgressBar,
} from "react-bootstrap";
import Graph1 from "../../components/Graph1";
import {
  People,
  Folder,
  Clipboard,
  Percent,
  HouseFill,
  Search,
} from "react-bootstrap-icons";
import { FiFilter } from "react-icons/fi";
import { useEffect, useState } from "react";
const stats = [
  { label: "Active Employees", value: 547, icon: <People size={24} /> },
  { label: "Number of Projects", value: 339, icon: <Folder size={24} /> },
  { label: "Number of Tasks", value: 147, icon: <Clipboard size={24} /> },
  {
    label: "Target Percentage Completed",
    value: "89.75%",
    icon: <Percent size={24} />,
  },
];

const taskData = [
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKvoUNdvnCKgYlMNBcCT2FSPLlertZ8WynvBuafp6m3Dwgytj7rNkTYUqNBT_yhJtInnY&usqp=CAU",
    title: "Journey Scarves",
    subtitle: "Rebranding and Website Design",
    status: "On Going",
    presentation: "51%",
    due: "Aug, 17 2024",
    avatars: [
      "https://i.pravatar.cc/400?img=69",
      "https://i.pravatar.cc/400?img=68",
      "https://i.pravatar.cc/400?img=67",
    ],
  },
  {
    image:
      "https://img.freepik.com/free-vector/colorful-company-logo-template-with-tagline_23-2148802643.jpg?semt=ais_hybrid&w=740",
    title: "Edifier",
    subtitle: "Web Design & Development",
    status: "On Going",
    presentation: "51%",
    due: "Aug, 17 2024",
    avatars: [
      "https://i.pravatar.cc/400?img=69",
      "https://i.pravatar.cc/400?img=67",
    ],
  },
  {
    image:
      "https://img.freepik.com/premium-vector/arrow-logo-design_369465-60.jpg",
    title: "Ugreen",
    subtitle: "Web App & Dashboard",
    status: "On Going",
    presentation: "89%",
    due: "Aug, 15 2024",
    avatars: [
      "https://i.pravatar.cc/400?img=68",
      "https://i.pravatar.cc/400?img=67",
    ],
  },
];

const topPerformers = [
  { rank: "1st", name: "Meylina", img: "https://i.pravatar.cc/400?img=57" },
  { rank: "2nd", name: "Jonathan", img: "https://i.pravatar.cc/400?img=52" },
  { rank: "3rd", name: "Yasmine", img: "https://i.pravatar.cc/400?img=51" },
  { rank: "4th", name: "Ronald", img: "https://i.pravatar.cc/400?img=47" },
];

const DashboardStats = () => {
  const [transcript, setTranscript] = useState([]);
  const [witness, setWitness] = useState([]);
  const [witnessType, setWitnessType] = useState([]);
  const [witnessAlignment, setWitnessAlighment] = useState([]);
  const [stats, setStats] = useState([]);
  const fetchTranscripts = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_PROD_API_URL}/api/transcript/`
      );
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      const lenRes = data.transcripts.length;
      setStats((prevStats) => {
        const filteredStats = prevStats.filter(
          (stat) => stat.label !== "Transcripts"
        );
        return [
          ...filteredStats,
          {
            label: "Transcripts",
            value: lenRes,
            icon: <People size={24} />,
          },
        ];
      });
      //   setTranscript(data.transcripts);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchWitness = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_PROD_API_URL}/api/witness/`
      );
      const data = await res.json();
      const lenRes = data.witnesses.length;
      setStats((prevStats) => {
        const filteredStats = prevStats.filter(
          (stat) => stat.label !== "Witnesses"
        );
        return [
          ...filteredStats,
          {
            label: "Witnesses",
            value: lenRes,
            icon: <Clipboard size={24} /> ,
          },
        ];
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchWitnessType = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_PROD_API_URL}/api/witness-type/`
      );
      const data = await res.json();
      const lenRes = data.witnesses.length;
      setStats((prevStats) => {
        const filteredStats = prevStats.filter(
          (stat) => stat.label !== "Witness Tyes"
        );
        return [
          ...filteredStats,
          {
            label: "Witness Tyes",
            value: lenRes,
            icon: <People size={24} />,
          },
        ];
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchWitnessAlignment = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_PROD_API_URL}/api/witness-alignment/`
      );
      const data = await res.json();
      const lenRes = data.witnesses.length;

      setStats((prevStats) => {
        const filteredStats = prevStats.filter(
          (stat) => stat.label !== "Witness Alignments"
        );
        return [
          ...filteredStats,
          {
            label: "Witness Alignments",
            value: lenRes,
            icon: <People size={24} />,
          },
        ];
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchTranscripts();
    fetchWitness();
    fetchWitnessType();
    fetchWitnessAlignment();
  }, []);
  return (
    <>
      {/* breadcreumb */}
      <Container fluid className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-primary bg-gradient text-white rounded-3 d-flex align-items-center justify-content-center"
              style={{ width: 32, height: 32 }}
            >
              <HouseFill size={16} />
            </div>
            <span className="fw-semibold text-dark">Dashboard</span>
          </div>

          <Breadcrumb className="link-breadumb">
            <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </Container>

      {/* Card */}
      <Container fluid>
        <Row className="g-3">
          {stats.map((stat, index) => (
            <Col xs={12} sm={6} xl={3} lg={6} md={6} key={index}>
              <Card className="sorath-card border-0">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div className="card-content-sorath">
                    <div className="d-flex justify-content-between">
                      <p className="text-label-sorath">{stat.label}</p>
                      <a href="/square-link" className="square-icon-link">
                        <svg
                          id="Layer_1"
                          data-name="Layer 1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 163 163"
                        >
                          <title>square</title>
                          <path
                            class="square-icon-sorath"
                            d="M317.33,163.67v-37.1a26.9,26.9,0,0,0-26.9-26.9h-37.1"
                            transform="translate(-156.83 -97.17)"
                          />
                          <path
                            class="square-icon-sorath"
                            d="M159.33,193.67v37.09a26.91,26.91,0,0,0,26.91,26.91h37.09"
                            transform="translate(-156.83 -97.17)"
                          />
                          <path
                            class="square-icon-sorath"
                            d="M223.33,99.67H186.24a26.9,26.9,0,0,0-26.91,26.9v37.1"
                            transform="translate(-156.83 -97.17)"
                          />
                          <path
                            class="square-icon-sorath"
                            d="M253.33,257.67h37.1a26.9,26.9,0,0,0,26.9-26.91V193.67"
                            transform="translate(-156.83 -97.17)"
                          />
                        </svg>
                      </a>
                    </div>

                    <div className="d-flex align-items-center">
                      <div className="label-icon-sorath">{stat.icon}</div>
                      <h5 className="mb-0 fw-semibold ms-3">{stat.value}</h5>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* 3 section layout */}

      <Container fluid className="py-4">
        <Row className="g-4">
          {/* Left Column */}
          <Col lg={6}>
            {/* On Going Task Section */}
            <Card className="p-3 sorath-card border-0 rounded-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <div className="label-icon-sorath bg-primary bg-gradient border-0">
                    <svg
                      id="Layer_1"
                      data-name="Layer 1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 388.6 330.01"
                      fill="#fff"
                    >
                      <title>graph</title>
                      <path
                        d="M227,503.11c2-6.2,6.32-10.7,10.83-15.18q37.54-37.32,74.95-74.81c10.44-10.43,21.25-10.41,31.73.06q28.19,28.17,56.34,56.37a19.1,19.1,0,0,1,2.2,3.14L541,335.11c-3.35-3.23-6.89-6.59-10.38-10q-3.93-3.86-7.72-7.84c-3.45-3.63-5.24-7.68-3.23-12.75s5.86-7.5,11.09-7.78q22.92-1.26,45.85-2.33c7.71-.38,15.42-.7,23.13-1,11.43-.46,16.35,4.15,15.88,15.46-.9,21.86-1.9,43.72-3.18,65.57a19.67,19.67,0,0,1-3.44,9.76c-4.44,6.24-11.59,7-17.05,1.72-6.37-6.14-12.17-12.86-18.5-19.64-2,1.87-3,2.85-4.06,3.88L419.58,519.88c-8,8-17.31,9.67-25.7,4.47a33.41,33.41,0,0,1-5.79-4.85q-28.23-28.14-56.38-56.34c-1-1-2-1.88-3.15-3-1.16,1.1-2.16,2-3.13,3-19.51,19.5-39.43,38.6-58.39,58.61-15.74,16.62-33.76,5.15-39.22-9.45a15.39,15.39,0,0,0-.82-1.62Z"
                        transform="translate(-227 -293.35)"
                      />
                      <path
                        d="M572.28,400.26c4.42,2.11,5,5.48,5,9.59q-.15,101.08-.08,202.17c0,1.52,0,3-.1,4.55-.36,3.93-2.58,6.54-6.47,6.58q-24.65.26-49.3,0c-4.11,0-6.38-2.69-6.7-6.77-.09-1.14-.07-2.28-.07-3.42q0-75.48-.07-151a9.31,9.31,0,0,1,3.07-7.24q26.13-25.89,52.07-52C570.48,401.92,571.4,401.08,572.28,400.26Z"
                        transform="translate(-227 -293.35)"
                      />
                      <path
                        d="M490.26,482.42V612.88c0,8.37-2.12,10.46-10.59,10.46q-21.26,0-42.51,0c-7.5,0-9.74-2.27-9.75-9.72,0-22.14,0-44.28-.05-66.42,0-2.53.64-4.16,2.8-5.6a43.42,43.42,0,0,0,6.23-5.53q25.13-25.05,50.2-50.16C487.55,485,488.55,484,490.26,482.42Z"
                        transform="translate(-227 -293.35)"
                      />
                      <path
                        d="M340.51,505.1c1.4,1.27,2.32,2,3.16,2.89,9.31,9.29,18.71,18.49,27.87,27.93,8.15,8.4,17.64,13.79,29.5,14.54a13.78,13.78,0,0,1,2.09.51v8.32q0,27.32,0,54.62c0,7-2.3,9.4-9.25,9.42q-22.19.06-44.38,0c-6.65,0-9.15-2.51-9.16-9.19q0-52.9,0-105.82C340.34,507.48,340.42,506.65,340.51,505.1Z"
                        transform="translate(-227 -293.35)"
                      />
                      <path
                        d="M253.42,553.25c13.08-1.07,22.76-7.45,31.3-16.27,10-10.34,20.3-20.4,31.07-31.17.13,1.92.27,3.09.27,4.26q0,51.81,0,103.62c0,7.46-2.22,9.64-9.77,9.65q-21.63,0-43.27,0c-7.35,0-9.6-2.21-9.6-9.4q0-28.47,0-56.93Z"
                        transform="translate(-227 -293.35)"
                      />
                    </svg>
                  </div>
                  <div className="mb-0 ms-3">
                    <h5 className="mb-0 fw-semibold">On Going Task</h5>
                    <small className="text-muted">
                      Projects completed per month based on trends.
                    </small>
                  </div>
                </div>

                <div className="activity-leftside d-flex align-items-center">
                  <Search size={20} className="text-secondary icon-header" />
                  <FiFilter
                    size={20}
                    className="text-secondary icon-header ms-2"
                  />
                </div>
              </div>

              {/* Task Cards */}
              {taskData.map((task, i) => (
                <Card key={i} className="mb-3 border-0 sorath-card p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="border-0">
                        <img
                          src={task.image}
                          alt="task Logo"
                          width={60}
                          height={60}
                          className="tasklogo"
                        />
                      </div>
                      <div className="mb-0 ms-3">
                        <h6 className="fw-bold mb-1">{task.title}</h6>
                        <small className="text-muted">{task.subtitle}</small>
                      </div>
                    </div>
                    <div className="d-flex">
                      {task.avatars.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="avatar"
                          className="rounded-circle ms-1"
                          style={{ width: 32, height: 32, objectFit: "cover" }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-3">
                    <div>
                      <small className="text-muted">Status</small>
                      <div className="fw-semibold">{task.status}</div>
                    </div>
                    <div>
                      <small className="text-muted">Presentation</small>
                      <div className="fw-semibold">{task.presentation}</div>
                    </div>
                    <div>
                      <small className="text-muted">Due Date</small>
                      <div className="fw-semibold">{task.due}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </Card>
          </Col>

          {/* Right Column */}
          <Col lg={6}>
            <Row className="g-4">
              {/* Graph1 */}
              <Col md={12}>
                <Card className="p-3 sorath-card border-0 rounded-4">
                  <Graph1 />
                </Card>
              </Col>

              {/* Top Performance */}
              <Col md={12}>
                <Card className="p-3 sorath-card border-0 rounded-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <div className="label-icon-sorath bg-primary bg-gradient border-0">
                        <svg
                          id="Layer_1"
                          data-name="Layer 1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 388.6 330.01"
                          fill="#fff"
                        >
                          <title>graph</title>
                          <path
                            d="M227,503.11c2-6.2,6.32-10.7,10.83-15.18q37.54-37.32,74.95-74.81c10.44-10.43,21.25-10.41,31.73.06q28.19,28.17,56.34,56.37a19.1,19.1,0,0,1,2.2,3.14L541,335.11c-3.35-3.23-6.89-6.59-10.38-10q-3.93-3.86-7.72-7.84c-3.45-3.63-5.24-7.68-3.23-12.75s5.86-7.5,11.09-7.78q22.92-1.26,45.85-2.33c7.71-.38,15.42-.7,23.13-1,11.43-.46,16.35,4.15,15.88,15.46-.9,21.86-1.9,43.72-3.18,65.57a19.67,19.67,0,0,1-3.44,9.76c-4.44,6.24-11.59,7-17.05,1.72-6.37-6.14-12.17-12.86-18.5-19.64-2,1.87-3,2.85-4.06,3.88L419.58,519.88c-8,8-17.31,9.67-25.7,4.47a33.41,33.41,0,0,1-5.79-4.85q-28.23-28.14-56.38-56.34c-1-1-2-1.88-3.15-3-1.16,1.1-2.16,2-3.13,3-19.51,19.5-39.43,38.6-58.39,58.61-15.74,16.62-33.76,5.15-39.22-9.45a15.39,15.39,0,0,0-.82-1.62Z"
                            transform="translate(-227 -293.35)"
                          />
                          <path
                            d="M572.28,400.26c4.42,2.11,5,5.48,5,9.59q-.15,101.08-.08,202.17c0,1.52,0,3-.1,4.55-.36,3.93-2.58,6.54-6.47,6.58q-24.65.26-49.3,0c-4.11,0-6.38-2.69-6.7-6.77-.09-1.14-.07-2.28-.07-3.42q0-75.48-.07-151a9.31,9.31,0,0,1,3.07-7.24q26.13-25.89,52.07-52C570.48,401.92,571.4,401.08,572.28,400.26Z"
                            transform="translate(-227 -293.35)"
                          />
                          <path
                            d="M490.26,482.42V612.88c0,8.37-2.12,10.46-10.59,10.46q-21.26,0-42.51,0c-7.5,0-9.74-2.27-9.75-9.72,0-22.14,0-44.28-.05-66.42,0-2.53.64-4.16,2.8-5.6a43.42,43.42,0,0,0,6.23-5.53q25.13-25.05,50.2-50.16C487.55,485,488.55,484,490.26,482.42Z"
                            transform="translate(-227 -293.35)"
                          />
                          <path
                            d="M340.51,505.1c1.4,1.27,2.32,2,3.16,2.89,9.31,9.29,18.71,18.49,27.87,27.93,8.15,8.4,17.64,13.79,29.5,14.54a13.78,13.78,0,0,1,2.09.51v8.32q0,27.32,0,54.62c0,7-2.3,9.4-9.25,9.42q-22.19.06-44.38,0c-6.65,0-9.15-2.51-9.16-9.19q0-52.9,0-105.82C340.34,507.48,340.42,506.65,340.51,505.1Z"
                            transform="translate(-227 -293.35)"
                          />
                          <path
                            d="M253.42,553.25c13.08-1.07,22.76-7.45,31.3-16.27,10-10.34,20.3-20.4,31.07-31.17.13,1.92.27,3.09.27,4.26q0,51.81,0,103.62c0,7.46-2.22,9.64-9.77,9.65q-21.63,0-43.27,0c-7.35,0-9.6-2.21-9.6-9.4q0-28.47,0-56.93Z"
                            transform="translate(-227 -293.35)"
                          />
                        </svg>
                      </div>
                      <div className="mb-0 ms-3">
                        <h5 className="mb-0 fw-semibold">Top Performance</h5>
                        <small className="text-muted">
                          Projects completed per month based on trends.
                        </small>
                      </div>
                    </div>

                    <select className="month-dropdown-sorath w-auto">
                      <option>Augustus</option>
                      <option>January</option>
                    </select>
                  </div>

                  <div className="d-flex justify-content-around flex-wrap">
                    {topPerformers.map((person, idx) => (
                      <div key={idx} className="text-center">
                        <img
                          src={person.img}
                          alt="user"
                          className="rounded-3 mb-2"
                          style={{ width: 80, height: 80, objectFit: "cover" }}
                        />
                        <div className="toper-name-sorath">
                          <p className="fw-semibold mb-0">{person.rank} </p>
                          <span>{person.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DashboardStats;
