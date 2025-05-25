import { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  SimpleGrid,
  HStack,
  Heading,
  Slider,
  Image,
  Text,
  Link,
} from "@chakra-ui/react";

import chroma from "chroma-js";


import GPUCard from "./components/cards/GPUCard.jsx";
import CPUCard from "./components/cards/CPUCard.jsx";

import {GPU_HOSTS,CPU_HOSTS,HOSTS} from "./hosts.jsx";

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();


function AnimatedMulti({ setSelectedHosts }) {
    const options = [
    { value: "all", label: "", type: "all" },
    ...GPU_HOSTS.map((host) => ({
        value: host,
        label: host,
        type: "gpu",
    })),
    ...CPU_HOSTS.map((host) => ({
        value: host,
        label: host,
        type: "cpu",
    })),
    ];

  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      isMulti
      placeholder="Select hosts..."
      options={options}
      defaultValue={[]}
      onChange={(selected) => {
        if (!selected || selected.length === 0) {
          setSelectedHosts("all");
        } else if (selected.some((opt) => opt.value === "all")) {
          setSelectedHosts("all");
        } else {
          setSelectedHosts(selected.map((opt) => opt.value));
        }
      }}

    />
  );
}



function App() {
  const [gpuData, setGpuData] = useState({});
  const [cpuData, setCpuData] = useState({});
  const [lastUpdated, setLastUpdated] = useState({});
  const [columnCount, setColumnCount] = useState(3);
  const [selectedHosts, setSelectedHosts] = useState("all");

    const visibleGpuHosts =
    selectedHosts === "all"
        ? GPU_HOSTS
        : GPU_HOSTS.filter((host) => selectedHosts.includes(host));

    const visibleCpuHosts =
    selectedHosts === "all"
        ? CPU_HOSTS
        : CPU_HOSTS.filter((host) => selectedHosts.includes(host));

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
              setGpuData(prev => ({ ...prev, [host]: {"error": "Failed to fetch from host"} }));
              setCpuData(prev => ({ ...prev, [host]: {"error": "Failed to fetch from host"} }));
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
      {/* Header */}
    <HStack justify="space-between" w="100%" px={2} pb={0} mb={0}>
      <HStack>
        <Heading mb={0} fontSize="2xl">
          nodeWatch
        </Heading>
        <Image src={`/icons/nodewatcher.gif`} boxSize="40px" alt="nodewatch logo" />
      </HStack>

      <HStack gap={8}>
        <AnimatedMulti selectedHosts={selectedHosts} setSelectedHosts={setSelectedHosts} />
        <HStack gap={2}>
        <Text fontSize="sm">Cols: {columnCount}</Text>
        <Box w="100px">
          <Slider.Root
            min={1}
            max={4}
            step={1}
            value={[columnCount]}
            onValueChange={(e) => setColumnCount(e.value)}
          >
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumb index={0} cursor="pointer" />
            </Slider.Control>
          </Slider.Root>
        </Box>
        </HStack>
      </HStack>
    </HStack>

      <Tabs.Root defaultValue={"gpu"}>
        <Tabs.List>
          <Tabs.Trigger value="gpu">GPU</Tabs.Trigger>
          <Tabs.Trigger value="cpu">CPU</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="gpu">
          <SimpleGrid columns={columnCount} gap={5} pt={4}>
            {visibleGpuHosts.map((host) => (
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
          <SimpleGrid columns={columnCount} gap={5} pt={2}>
            {visibleCpuHosts.map((host) => (
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

        <Box
        as="footer"
        mt={8}
        py={2}
        borderTop="1px solid"
        borderColor="gray.200"
        textAlign="center"
        fontSize="xs"
        color="gray.500"
        >
        Made by{" "}
        <Link href="https://mihirbafna.github.io/" isExternal color="pink.500" fontWeight="medium">
            Mihir Bafna
        </Link>{" "}
        and{" "}
        <Link href="https://people.csail.mit.edu/bjing/" isExternal color="pink.500" fontWeight="medium">
            Bowen Jing 
        </Link>

         &nbsp;(<Link href="https://labberger.github.io/" isExternal color="gray.500" fontWeight="bold">
            Berger Lab
        </Link> 2025)
        </Box>
    </Box>
  );
}

export default App;
