import { useEffect, useState } from "react";
import {
  Alert,
  Tabs,
  SimpleGrid,
  Heading,
  Text,
  Table,
  Spinner,
  Slider,
  Card,
  Box,
  Separator,
  Flex,
  HStack,
  Badge,
  Image,
  Status
} from "@chakra-ui/react";

const GPU_HOSTS = ["minotaur", "cyclops", "asura", "dementor", "kappa", "charybdis", "wookiee", "imp"];
const CPU_HOSTS = ["oni", "satyr", "golem", "kyogre", "dragon",  "giant", "yokai","godzilla"];
const HOSTS = [...GPU_HOSTS, ...CPU_HOSTS];

function getGPURowColor(gpu) {
  const util = gpu["utilization.gpu"];
  const memUsed = gpu["memory.used"];
  if (util > 75) return "#a50000";
  if (util > 0) return "#a05000";
  if (util === 0 && memUsed > 1024) return "#ff00b5";
  return "#076301";
}

function sumCPU(cpuUsage) {
  return Object.values(cpuUsage).reduce((a, b) => a + b, 0);
}

function sumMem(memUsage) {
  return Object.values(memUsage).reduce((a, b) => a + b, 0);
}

function App() {
  const [gpuData, setGpuData] = useState({});
  const [cpuData, setCpuData] = useState({});
  const [lastUpdated, setLastUpdated] = useState({});
  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const fetchData = () => {
      HOSTS.forEach((host) => {
        fetch(`http://${host}.csail.mit.edu:9988/gpustat`)
          .then((res) => res.json())
          .then((data) => {
            if (GPU_HOSTS.includes(host)) {
              if ("error" in data) {
                setGpuData((prev) => ({ ...prev, [host]: { error: data.error } }));
              } else {
                setGpuData((prev) => ({ ...prev, [host]: data.gpus }));
              }
            }
            setCpuData((prev) => ({ ...prev, [host]: data.cpu }));
            setLastUpdated((prev) => ({
              ...prev,
              [host]: new Date().toLocaleTimeString(),
            }));
          })
          .catch(() => {
            if (GPU_HOSTS.includes(host)) {
              setGpuData((prev) => ({ ...prev, [host]: null }));
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
      <HStack justify="space-between" w="100%">
        <HStack>
          <Heading mb={0} fontSize="2xl">nodeWatch</Heading>
          <Image src={`/icons/nodewatcher.gif`} boxSize="40px" />
        </HStack>

        <HStack spacing={2}>
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
                <Slider.Thumb index={0} cursor="pointer"/>
              </Slider.Control>
            </Slider.Root>
          </Box>
        </HStack>
      </HStack>

      <br />
      <Tabs.Root defaultValue="gpu">
      <Tabs.List>
        <Tabs.Trigger value="gpu">
          GPU
        </Tabs.Trigger>
        <Tabs.Trigger value="cpu">
          CPU
        </Tabs.Trigger>
      </Tabs.List>


      <Tabs.Content value="gpu">
      {/* Host Cards */}
      <SimpleGrid columns={columnCount} gap="5" pt={5}>
        {GPU_HOSTS.map((host) => {
          return (
          <Box >
            <Card.Root
              key={host}
              border="2px solid"
              borderColor="gray.200"
              borderRadius="lg"
              boxShadow="sm"
              p={0}
              bg="white"
              position="relative"
              _dark={{ bg: "gray.800", borderColor: "gray.700" }}
              _hover={{ boxShadow: "md", transform: "translateY(-2px)", transition: "all 0.2s" }}
            >
              <Card.Header pb={1} mb={0}>
                <Flex justify="space-between" align="center" w="100%">
                  <HStack p={1}>
                    {/* Status dot */}
                    { (gpuData[host] === null) ? (
                        <Status.Root colorPalette="orange"><Status.Indicator /></Status.Root>
                      ) : gpuData[host]?.error ? (
                        <Status.Root colorPalette="red"><Status.Indicator /></Status.Root>
                      ) : (
                        <Status.Root colorPalette="green"><Status.Indicator /></Status.Root>
                      ) }

                    <Heading size="md">{host}</Heading>
                    <Image src={`/icons/${host}.gif`} boxSize="35px" alt=""/>
                  </HStack>

                  <Badge colorPalette={"pink"}>
                    { "GPU" }
                  </Badge>
                </Flex>
              </Card.Header>

              <Separator />

              <Card.Body pt={2} mb={3}>
                {/* GPU Section */}
                {
                  !gpuData[host] ? (
                    <Spinner />
                  ) : gpuData[host]?.error ? (
                    <Alert.Root status="error">
                      <Alert.Indicator />
                      <Alert.Content>
                        <Alert.Title>Error</Alert.Title>
                        <Alert.Description>{gpuData[host].error}</Alert.Description>
                      </Alert.Content>
                    </Alert.Root>
                  ) : (
                    <Box overflowX="auto" whiteSpace="nowrap">
                      <Table.Root fontSize="xs" minW="600px">
                        <Table.Header>
                          <Table.Row fontWeight={700}>
                            <Table.Cell px={2} py={1}>Rank</Table.Cell>
                            <Table.Cell px={2} py={1}>Card</Table.Cell>
                            <Table.Cell px={2} py={1}>Temp.</Table.Cell>
                            <Table.Cell px={2} py={1}>Memory</Table.Cell>
                            <Table.Cell px={2} py={1}>Util.</Table.Cell>
                            <Table.Cell px={2} py={1}>Processes</Table.Cell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {gpuData[host]?.map((gpu) => (
                            <Table.Row key={gpu.uuid} color={getGPURowColor(gpu)}>
                              <Table.Cell px={2} py={1}>{gpu.index}</Table.Cell>
                              <Table.Cell px={2} py={1}>{gpu.name}</Table.Cell>
                              <Table.Cell px={2} py={1}>{gpu["temperature.gpu"]}°C</Table.Cell>
                              <Table.Cell px={2} py={1}>
                                {gpu["memory.used"]} / {gpu["memory.total"]} MB
                              </Table.Cell>
                              <Table.Cell px={2} py={1}>{gpu["utilization.gpu"]}%</Table.Cell>
                              <Table.Cell px={2} py={1}>{gpu["user_processes"]}</Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Root>
                    </Box>
                  )}

                {/* CPU Section (for both types) */}
                {/* {cpuData[host] && (
                  <Box pl={2} pr={5} mt={3}>
                    <Flex fontSize="xs" fontWeight="semibold" mb={1} gap={4}>
                      <Text whiteSpace="nowrap">CPU ({cpuData[host].n_cpus} CORES)</Text>
                      <Text>{sumCPU(cpuData[host].cpu_usage).toFixed(0)}%</Text>
                      <Text>
                        {sumMem(cpuData[host].mem_usage).toFixed(0)} / {cpuData[host].total_mem.toFixed(0)} (GB)
                      </Text>
                    </Flex>

                    {Object.keys(cpuData[host].cpu_usage)
                      .filter((name) => cpuData[host].cpu_usage[name] > 0 || cpuData[host].mem_usage[name] > 0)
                      .map((name) => (
                        <Flex key={name} fontSize="2xs" gap={4}>
                          <Text w="80px" isTruncated>{name}</Text>
                          <Text>{cpuData[host].cpu_usage[name].toFixed(0)}%</Text>
                          <Text>
                            {cpuData[host].mem_usage[name].toFixed(0)} / {cpuData[host].total_mem.toFixed(0)} (GB)
                          </Text>
                        </Flex>
                      ))}
                  </Box>
                )} */}

                {/* Timestamp */}
                <Text
                  fontSize="2xs"
                  color="gray.500"
                  position="absolute"
                  bottom="10px"
                  right="25px"
                >
                  {lastUpdated[host] || "—"}
                </Text>
              </Card.Body>
            </Card.Root>
            </Box>
          );
        })}
      </SimpleGrid>
      </Tabs.Content>
      <Tabs.Content value="cpu">
      <SimpleGrid columns={columnCount} gap="5" pt={5}>
        {CPU_HOSTS.map((host) => {
          const isCPUHost = CPU_HOSTS.includes(host);
          return (
            <Card.Root
              key={host}
              border="2px solid"
              borderColor="gray.200"
              borderRadius="lg"
              boxShadow="sm"
              p={0}
              bg="white"
              position="relative"
              _dark={{ bg: "gray.800", borderColor: "gray.700" }}
              _hover={{ boxShadow: "md", transform: "translateY(-2px)", transition: "all 0.2s" }}
            >
              <Card.Header pb={1} mb={0}>
                <Flex justify="space-between" align="center" w="100%">
                  <HStack p={1}>
                    {/* Status dot */}
                    {isCPUHost ? (
                      cpuData[host] === null ? (
                        <Status.Root colorPalette="orange"><Status.Indicator /></Status.Root>
                      ) : isCPUHost[host]?.error ? (
                        <Status.Root colorPalette="red"><Status.Indicator /></Status.Root>
                      ) : (
                        <Status.Root colorPalette="green"><Status.Indicator /></Status.Root>
                      )
                    ) : (
                      <Status.Root colorPalette="green"><Status.Indicator /></Status.Root>
                    )}

                    <Heading size="md">{host}</Heading>
                    <Image src={`/icons/${host}.gif`} boxSize="35px" alt=""/>
                  </HStack>

                  <Badge colorPalette={"cyan"}>
                    CPU
                  </Badge>
                </Flex>
              </Card.Header>

              <Separator />

              <Card.Body pt={2} mb={3}>

                {/* CPU Section (for both types) */}
                {cpuData[host] && (
                  <Box pl={2} pr={5} mt={3}>
                    <Flex fontSize="xs" fontWeight="semibold" mb={1} gap={4}>
                      <Text whiteSpace="nowrap">CPU ({cpuData[host].n_cpus} CORES)</Text>
                      <Text>{sumCPU(cpuData[host].cpu_usage).toFixed(0)}%</Text>
                      <Text>
                        {sumMem(cpuData[host].mem_usage).toFixed(0)} / {cpuData[host].total_mem.toFixed(0)} (GB)
                      </Text>
                    </Flex>

                    {Object.keys(cpuData[host].cpu_usage)
                      .filter((name) => cpuData[host].cpu_usage[name] > 0 || cpuData[host].mem_usage[name] > 0)
                      .map((name) => (
                        <Flex key={name} fontSize="2xs" gap={4}>
                          <Text w="80px" isTruncated>{name}</Text>
                          <Text>{cpuData[host].cpu_usage[name].toFixed(0)}%</Text>
                          <Text>
                            {cpuData[host].mem_usage[name].toFixed(0)} / {cpuData[host].total_mem.toFixed(0)} (GB)
                          </Text>
                        </Flex>
                      ))}
                  </Box>
                )}

                {/* Timestamp */}
                <Text
                  fontSize="2xs"
                  color="gray.500"
                  position="absolute"
                  bottom="10px"
                  right="25px"
                >
                  {lastUpdated[host] || "—"}
                </Text>
              </Card.Body>
            </Card.Root>
          );
        })}

      </SimpleGrid>
      </Tabs.Content>
      </Tabs.Root>

    </Box>
  );
}

export default App;
