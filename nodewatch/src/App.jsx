import { useEffect, useState } from "react";
import {
  Alert,Tabs,
  SimpleGrid,
  Heading,
  Text,
  Table,
  Spinner,
  Slider,
  Card,
  Box,
  Separator,
  Stack,
  Status,
  Image,
  HStack,
  Flex,
  Badge
} from "@chakra-ui/react";

const GPU_HOSTS = ["minotaur", "cyclops", "asura", "dementor", "kappa", "charybdis", "wookiee", "imp"];
// const CPU_HOSTS = ["oni", "yokai", "satyr", "golem", "kyogre", "dragon", "godzilla", "giant"];
const CPU_HOSTS = [];
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
  const [columnCount, setColumnCount] = useState(2);

  useEffect(() => {
    const fetchData = () => {
      HOSTS.forEach((host) => {
        fetch(`http://${host}.csail.mit.edu:9988/gpustat`)
          .then((res) => res.json())
          .then((data) => {
            // print(data)
            if ("error" in data) {
              console.log(data.cpu)
              setGpuData((prev) => ({ ...prev, [host]: { error: data.error } }));
            } else {
              setGpuData((prev) => ({ ...prev, [host]: data.gpus }));
            }
            setCpuData((prev) => ({ ...prev, [host]: data.cpu }));
            setLastUpdated((prev) => ({
              ...prev,
              [host]: new Date().toLocaleTimeString(),
            }));
          })
          .catch(() => {
            setGpuData((prev) => ({ ...prev, [host]: null }));
          });
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
      <Box p={4} fontSize="xs">
        <HStack justify="space-between" w="100%">
          <HStack>
            <Heading mb={0}>nodeWatch</Heading>
            <Image src={`/icons/nodewatcher.gif`} boxSize="40px" />
          </HStack>

          <HStack spacing={2}>
            <Text fontSize="sm">Cols: {columnCount}</Text>
            {/* <TbColumns1 /> */}
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
                  <Slider.Thumb index={0} />
                </Slider.Control>
              </Slider.Root>
              {/* <LuColumns4 /> */}
            </Box>
          </HStack>
        </HStack>
        <br/>
        <SimpleGrid columns={columnCount} gap="5">
          {HOSTS.map((host) => (
            <Card.Root
              key={host}
              border="2px solid"
              borderColor="gray.200"
              borderRadius="lg"
              boxShadow="sm"
              p={0}
              bg="white"
              _dark={{ bg: "gray.800", borderColor: "gray.700" }}
              _hover={{ boxShadow: "md", transform: "translateY(-2px)", transition: "all 0.2s" }}
            >              

            <Card.Header pb={1} mb={0}>
              <Flex justify="space-between" align="center" w="100%">
                <HStack p={1}>
                  {gpuData[host] === null ? (
                    <Status.Root colorPalette="orange">
                      <Status.Indicator />
                    </Status.Root>
                  ) : gpuData[host] && "error" in gpuData[host] ? (
                    <Status.Root colorPalette="red">
                      <Status.Indicator />
                    </Status.Root>
                  ) : (
                    <Status.Root colorPalette="green">
                      <Status.Indicator />
                    </Status.Root>
                  )}

                  <Heading size="sm">{host}</Heading>
                  <Image src={`/icons/${host}.gif`} boxSize="35px" />
                </HStack>
                <Badge colorPalette="cyan">GPU</Badge>
      
              </Flex>
            </Card.Header>
            <Separator />

            <Card.Body pt={2} mb={3}>

            {/* <Tabs.Root defaultValue="GPU" alignContent="right"> */}
              {/* <Flex justify="flex-end" mb={2}>

              <Tabs.List align="end">
              <Tabs.Trigger value="GPU">
                <Text fontSize="xs">GPUs</Text>
              </Tabs.Trigger>
              <Tabs.Trigger value="CPU">
                <Text fontSize="xs">CPUs</Text>
              </Tabs.Trigger>
              </Tabs.List>
              </Flex> */}

            {/* <Tabs.Content value="GPU"> */}
            {/* GPU Tab */}
            {!gpuData[host] ? (
                <Spinner />
                ) : gpuData[host].error ? (
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
                      {gpuData[host].map((gpu) => (
                        <Table.Row key={gpu.uuid} color={getGPURowColor(gpu)}>
                          <Table.Cell whiteSpace="nowrap" px={2} py={1}>{gpu.index}</Table.Cell>
                          <Table.Cell whiteSpace="nowrap" px={2} py={1}>{gpu.name}</Table.Cell>
                          <Table.Cell whiteSpace="nowrap" px={2} py={1}>{gpu["temperature.gpu"]}°C</Table.Cell>
                          <Table.Cell whiteSpace="nowrap" px={2} py={1}>
                            {gpu["memory.used"]} / {gpu["memory.total"]} MB
                          </Table.Cell>
                          <Table.Cell whiteSpace="nowrap" px={2} py={1}>{gpu["utilization.gpu"]}%</Table.Cell>
                          <Table.Cell whiteSpace="nowrap" px={2} py={1}>
                            {gpu["user_processes"]}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Box>
              )}
            {/* </Tabs.Content> */}
            {/* <Tabs.Content value="CPU"> */}
            {/* {cpuData[host] && (
                          <Box  pl={2} pr={5}>
                            <Flex fontSize="xs" fontWeight="semibold" mb={1} gap={4}>
                              <Text whiteSpace="nowrap">
                                CPU ({cpuData[host].n_cpus} CORES)
                              </Text>
                              <Text>{sumCPU(cpuData[host].cpu_usage).toFixed(0)}%</Text>
                              <Text>
                                {sumMem(cpuData[host].mem_usage).toFixed(0)} /{" "}
                                {cpuData[host].total_mem.toFixed(0)} (GB)
                              </Text>
                            </Flex>

                            {Object.keys(cpuData[host].cpu_usage)
                              .filter(
                                (name) =>
                                  cpuData[host].cpu_usage[name] > 0 ||
                                cpuData[host].mem_usage[name] > 0
                              )
                              .map((name) => (
                                <Flex key={name} fontSize="2xs" gap={4}>
                                  <Text w="80px" isTruncated>{name}</Text>
                                  <Text>{cpuData[host].cpu_usage[name].toFixed(0)}%</Text>
                                  <Text>
                                    {cpuData[host].mem_usage[name].toFixed(0)} /{" "}
                                    {cpuData[host].total_mem.toFixed(0)} (GB)
                                  </Text>
                                </Flex>
                              ))}
                          </Box>
                        )} */}
                {/* </Tabs.Content> */}
            {/* </Tabs.Root> */}

            <Text fontSize="2xs" color="gray.500" position="absolute"
                    bottom="10px"
                    right="25px">
                  {lastUpdated[host] || "—"}
                </Text>
            </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
      </Box>
  );
}

export default App;
