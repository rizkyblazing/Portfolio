const projects = [
  {
    id: 1,
    title: "Network Infrastructure",
    questNumber: "01",
    description:
      "Design, configuration, troubleshooting and maintenance of network infrastructure. Ensuring stable and secure network connectivity across the organization.",
    technologies: ["MikroTik", "TCP-IP", "Routing", "QoS", "VLAN"],
    details: [
      "Network topology design and implementation",
      "MikroTik router configuration and management",
      "QoS policy implementation for bandwidth management",
      "VLAN segmentation for department isolation",
      "Network monitoring and troubleshooting",
    ],
  },
  {
    id: 2,
    title: "CCTV Infrastructure",
    questNumber: "02",
    description:
      "IP CCTV and NVR implementation, network configuration and troubleshooting for comprehensive security coverage.",
    technologies: ["Dahua", "NVR", "IP Camera", "Networking"],
    details: [
      "IP camera selection and deployment",
      "NVR configuration and storage management",
      "Network configuration for CCTV traffic",
      "Remote access and monitoring setup",
      "Periodic maintenance and troubleshooting",
    ],
  },
  {
    id: 3,
    title: "VoIP / PBX",
    questNumber: "03",
    description:
      "Implementation and troubleshooting of VoIP telephone systems for efficient internal and external communication.",
    technologies: ["FreePBX", "Yeastar", "SIP", "IP Phone"],
    details: [
      "VoIP system design and deployment",
      "FreePBX / Yeastar configuration",
      "SIP trunk setup and management",
      "IP phone provisioning and support",
      "Call quality optimization and troubleshooting",
    ],
  },
  {
    id: 4,
    title: "Server & Virtualization",
    questNumber: "04",
    description:
      "Server deployment, virtualization and system administration for reliable IT infrastructure backbone.",
    technologies: ["Windows Server", "Linux", "Docker", "Virtualization"],
    details: [
      "Physical and virtual server deployment",
      "Windows Server and Linux administration",
      "Docker containerization for services",
      "Backup and disaster recovery planning",
      "Performance monitoring and optimization",
    ],
  },
  {
    id: 5,
    title: "Production Monitoring System",
    questNumber: "05",
    description:
      "Web-based system for recording and monitoring brick production — production data input, tracking, and centralized reporting to support operational monitoring.",
    technologies: ["React.js", "REST API", "Database", "Monitoring"],
    details: [
      "Production data input and management",
      "Production tracking across shifts",
      "Centralized reporting dashboard",
      "Real-time operational monitoring",
    ],
  },
  {
    id: 6,
    title: "Sales CRM & WhatsApp Integration",
    questNumber: "06",
    description:
      "CRM system for brick sales integrated with the WhatsApp API, enabling centralized management of customer conversations, sales activities, and customer data through a web interface.",
    technologies: ["React.js", "WhatsApp API", "CRM", "REST API"],
    details: [
      "Centralized customer conversation management",
      "Sales activity tracking and pipeline",
      "Customer data management via web interface",
      "WhatsApp API integration for sales communication",
    ],
  },
  {
    id: 7,
    title: "AI Workflow Automation",
    questNumber: "07",
    description:
      "Automated repetitive business processes with n8n, AI Agents, REST API, and Webhooks — data synchronization, notifications, and CRM workflow automation.",
    technologies: ["n8n", "AI Agents", "Webhooks", "REST API"],
    details: [
      "Automated workflows for repetitive business processes",
      "AI agents for data processing and assistance",
      "Data synchronization and notifications",
      "CRM workflow integration",
    ],
  },
  {
    id: 8,
    title: "Web Server & SSL Infrastructure",
    questNumber: "08",
    description:
      "Configured Caddy Server as a reverse proxy with automated SSL/HTTPS, providing secure access to internal and business applications.",
    technologies: ["Caddy", "SSL", "Reverse Proxy", "HTTPS"],
    details: [
      "Caddy reverse proxy configuration",
      "Automated SSL/HTTPS setup",
      "Secure access to business applications",
      "Internal application exposure management",
    ],
  },
];

export default projects;
