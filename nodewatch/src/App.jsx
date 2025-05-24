import { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  SimpleGrid,
  Text,
  Heading,
  HStack,
  Slider,
  Spinner,
} from "@chakra-ui/react";

import Header from "./components/Header.jsx";
import GPUCard from "./components/cards/GPUCard.jsx";
import CPUCard from "./components/cards/CPUCard.jsx";

const GPU_HOSTS = ["minotaur", "cyclops", "asura", "dementor", "kappa", "charybdis", "imp", "wookiee"];
const CPU_HOSTS = ["oni", "satyr", "golem", "kyogre", "dragon", "giant", "yokai", "godzilla"];
const HOSTS = [...GPU_HOSTS, ...CPU_HOSTS];

function App() {
  const [gpuData, setGpuData] = useState({});
  const [cpuData, setCpuData] = useState({});
  const [lastUpdated, setLastUpdated] = useState({});
  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const fetchData = () => {
      HOSTS.forEach((host) => {
        fetch(`http://${host}.csail.mit.edu:9988/gpustat`)
          .then(res => res.json())
          .then(data => {
            if (GPU_HOSTS.includes(host)) {
              setGpuData(prev => ({
                ...prev,
                [host]: "error" in data ? { error: data.error } : data.gpus,
              }));
            }
            setCpuData(prev => ({ ...prev, [host]: data.cpu }));
            setLastUpdated(prev => ({ ...prev, [host]: new Date().toLocaleTimeString() }));
          })
          .catch(() => {
            if (GPU_HOSTS.includes(host)) {
              setGpuData(prev => ({ ...prev, [host]: null }));
            }
          });
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box p={4} fontSize="xs">
      <Header columnCount={columnCount} setColumnCount={setColumnCount} />

      <Tabs.Root mt={4} defaultValue={"gpu"}>
        <Tabs.List>
          <Tabs.Trigger value="gpu">GPU</Tabs.Trigger>
          <Tabs.Trigger value="cpu">CPU</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="gpu">
          <SimpleGrid columns={columnCount} gap={5} pt={4}>
            {GPU_HOSTS.map((host) => (
              <GPUCard
                key={host}
                host={host}
                gpuData={gpuData[host]}
                cpuData={cpuData[host]}
                lastUpdated={lastUpdated[host]}
                columnCount={columnCount}
              />
            ))}
          </SimpleGrid>
        </Tabs.Content>

        <Tabs.Content value="cpu">
          <SimpleGrid columns={columnCount} gap={5} pt={4}>
            {CPU_HOSTS.map((host) => (
              <CPUCard
                key={host}
                host={host}
                cpuData={cpuData[host]}
                lastUpdated={lastUpdated[host]}
                columnCount={columnCount}
              />
            ))}
          </SimpleGrid>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}

export default App;
