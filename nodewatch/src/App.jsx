import { useEffect, useState } from "react";
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Table,
  Spinner,
  Slider,
  Card,
  Stack,
  Status,
  Image,
  HStack,
  Flex
} from "@chakra-ui/react";

import { TbColumns1 } from "react-icons/tb";
import { LuColumns4 } from "react-icons/lu";


const HOSTS = [
  "minotaur",
  "cyclops",
  "asura",
  "dementor",
  "kappa",
  "charybdis",
  "wookiee",
  "imp",
];


function getGPURowColor(gpu) {
  const util = gpu["utilization.gpu"];
  const memUsed = gpu["memory.used"];

  if (util > 75) return "#a50000";
  if (util > 0) return "#a05000";          
  if (util === 0 && memUsed > 1024) return "#ff00b5"; 
  return "#076301";                       
}

function App() {
  const [gpuData, setGpuData] = useState({});
  const [lastUpdated, setLastUpdated] = useState({});
  const [columnCount, setColumnCount] = useState(2);

  useEffect(() => {
    const fetchData = () => {
      HOSTS.forEach((host) => {
        fetch(`http://${host}.csail.mit.edu:9988/gpustat`)
          .then((res) => res.json())
          .then((data) => {
            setGpuData((prev) => ({ ...prev, [host]: data.gpus }));
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
    const interval = setInterval(fetchData, 10000);
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
              boxShadow="md"
              p={0}
              bg="white"
              _dark={{ bg: "gray.800", borderColor: "gray.700" }}
              _hover={{ boxShadow: "md", transform: "translateY(-2px)", transition: "all 0.2s" }}
            >              

            <Card.Header>
              <Flex justify="space-between" align="center" w="100%">
                <HStack p={1}>
                  {gpuData[host] ? (
                    <Status.Root colorPalette="green"><Status.Indicator /></Status.Root>
                  ) : (
                    <Status.Root colorPalette="red"><Status.Indicator /></Status.Root>
                  )}
                  <Heading size="sm">{host}</Heading>
                  <Image src={`/icons/${host}.gif`} boxSize="35px" />
                </HStack>
                <Text fontSize="2xs" color="gray.500">
                  {lastUpdated[host] || "—"}
                </Text>
              </Flex>
            </Card.Header>

            <Card.Body p={5}>
            {!gpuData[host] ? (
                  <Spinner />
                ) : gpuData[host].length === 0 ? (
                  <Text color="red.400">
                    No GPU data returned from <b>{host}</b>. Host may be down or unresponsive.
                  </Text>
                ) : (
                <Box overflowX="auto" whiteSpace="nowrap">
                  <Table.Root fontSize="xs" minW="600px">
                    <Table.Header>
                      <Table.Row fontWeight={700}>
                        <Table.Cell px={2} py={1}>GPU</Table.Cell>
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
            </Card.Body>

            </Card.Root>
          ))}
        </SimpleGrid>
      </Box>
  );
}

export default App;
