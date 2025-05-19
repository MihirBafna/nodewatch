import { useEffect, useState } from "react";
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Table,
  Spinner,
  Card,
  Stack,
  Status,
  Image,
  HStack,
  Flex
} from "@chakra-ui/react";

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


function App() {
  const [gpuData, setGpuData] = useState({});
  const [lastUpdated, setLastUpdated] = useState({});

  useEffect(() => {
    const fetchData = () => {
      HOSTS.forEach((host) => {
        fetch(`http://${host}.csail.mit.edu:9988/gpustat`)
          .then((res) => res.json())
          .then((data) => {
            setGpuData((prev) => ({ ...prev, [host]: data.gpus }));
            setLastUpdated((prev) => ({
              ...prev,
              [host]: new Date().toLocaleTimeString(), // or Date.now()
            }));
          })
          .catch(() => {
            setGpuData((prev) => ({ ...prev, [host]: null }));
          });
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
      <Box p={4} fontSize="xs">
        <Heading mb={6}><HStack>nodeWatch<Image src={`/icons/nodewatcher.gif`} boxSize="2vw"/></HStack></Heading>
        <SimpleGrid columns={[1,2]}  gap="5">
          {HOSTS.map((host) => (
            <Card.Root
              key={host}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              boxShadow="sm"
              p={0}
              bg="white"
              _dark={{ bg: "gray.800", borderColor: "gray.700" }}
              _hover={{ boxShadow: "md", transform: "translateY(-2px)", transition: "all 0.2s" }}
            >              

            <Card.Header>
              <Flex justify="space-between" align="center" w="100%">
                <HStack spacing={2}>
                  {gpuData[host] ? (
                    <Status.Root colorPalette="green"><Status.Indicator /></Status.Root>
                  ) : (
                    <Status.Root colorPalette="red"><Status.Indicator /></Status.Root>
                  )}
                  <Heading size="sm">{host}</Heading>
                  <Image src={`/icons/${host}.gif`} boxSize="2vw" />
                </HStack>
                <Text fontSize="2xs" color="gray.500">
                  {lastUpdated[host] || "—"}
                </Text>
              </Flex>
            </Card.Header>

            <Card.Body p={3}>
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
                        <Table.Cell>GPU</Table.Cell>
                        <Table.Cell>Name</Table.Cell>
                        <Table.Cell>Temp</Table.Cell>
                        <Table.Cell>Memory</Table.Cell>
                        <Table.Cell>Utilization</Table.Cell>
                        <Table.Cell>Processes</Table.Cell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {gpuData[host].map((gpu) => (
                        <Table.Row key={gpu.uuid}>
                          <Table.Cell whiteSpace="nowrap">{gpu.index}</Table.Cell>
                          <Table.Cell whiteSpace="nowrap">{gpu.name}</Table.Cell>
                          <Table.Cell whiteSpace="nowrap">{gpu["temperature.gpu"]}°C</Table.Cell>
                          <Table.Cell whiteSpace="nowrap">
                            {gpu["memory.used"]} / {gpu["memory.total"]} MB
                          </Table.Cell>
                          <Table.Cell whiteSpace="nowrap">{gpu["utilization.gpu"]}%</Table.Cell>
                          <Table.Cell whiteSpace="nowrap">
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
