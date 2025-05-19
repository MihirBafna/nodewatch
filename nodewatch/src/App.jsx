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
} from "@chakra-ui/react";
import minotaur from "./assets/minotaur.gif";

const HOSTS = [
  "wookiee",
  "minotaur",
  "dementor",
  "kappa",
  "asura",
  "cyclops",
  "charybdis",
  "imp",
];

import { GiMinotaur } from "react-icons/gi";


function App() {
  const [gpuData, setGpuData] = useState({});

  useEffect(() => {
    const fetchData = () => {
      HOSTS.forEach((host) => {
        fetch(`http://${host}.csail.mit.edu:9988/gpustat`)
          .then((res) => res.json())
          .then((data) => {
            setGpuData((prev) => ({ ...prev, [host]: data.gpus }));
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
      <Box p={6} fontSize="xs">
        <Heading mb={6}>nodewatch</Heading>
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
                <Heading size="md">
                <HStack spacing={2}>
                {!gpuData[host] ? (
                <Status.Root colorPalette="red"> <Status.Indicator /> </Status.Root>) : 
                (<Status.Root colorPalette="green"><Status.Indicator /></Status.Root>)}
              {host}<Image src={minotaur} boxSize="30px" />
              </HStack>
                </Heading>
            </Card.Header>
              <Card.Body>
                {!gpuData[host] ? (
                  <Spinner />
                ) : (
                  <Stack spacing={3}>
                    <Table.Root  fontSize="xs">
                    <Table.Header>
                    <Table.Row fontWeight={700}>
                              <Table.Cell><Text>GPU</Text></Table.Cell>
                              <Table.Cell>Temp</Table.Cell>
                              <Table.Cell>Memory</Table.Cell>
                              <Table.Cell>Utilization</Table.Cell>
                              <Table.Cell>Processes</Table.Cell>
                              {/* <Table.Cell textAlign="end">{item.price}</Table.Cell> */}
                            </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {gpuData[host].map((gpu) => (
                          <Table.Row key={gpu.uuid}>
                              <Table.Cell><Text>{gpu.index}</Text></Table.Cell>
                              <Table.Cell>{gpu["temperature.gpu"]}°C</Table.Cell>
                              <Table.Cell>{gpu["memory.used"]} / {gpu["memory.total"]} MB</Table.Cell>
                              <Table.Cell>{gpu["utilization.gpu"]}%</Table.Cell>
                              <Table.Cell>{gpu["user_processes"]}</Table.Cell>
                              {/* <Table.Cell textAlign="end">{item.price}</Table.Cell> */}
                            </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                  </Stack>
                )}
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
      </Box>
  );
}

export default App;
