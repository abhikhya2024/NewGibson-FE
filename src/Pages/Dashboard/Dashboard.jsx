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

    
    </>
  );
};

export default DashboardStats;
