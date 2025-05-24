import {
  Card,
  CardHeader,
  CardBody,
  Box,
  Flex,
  HStack,
  Heading,
  Image,
  Text,
  Table,
  Badge,
  Spinner,
  Separator,
  Alert,
  Status,
} from "@chakra-ui/react";

function getGPURowColor(gpu) {
  const util = gpu["utilization.gpu"];
  const memUsed = gpu["memory.used"];
  if (util > 75) return "#a50000";
  if (util > 0) return "#a05000";
  if (util === 0 && memUsed > 1024) return "#ff00b5";
  return "#076301";
}

const GPUCard = ({ host, gpuData, cpuData, lastUpdated, columnCount }) => {
  return (
    <Box>
      <Card.Root
        border="2px solid"
        borderColor="gray.200"
        borderRadius="lg"
        boxShadow="sm"
        bg="white"
        position="relative"
        height="100%"
        width= {(columnCount == 1) ? "60%" : "100%"}
        _dark={{ bg: "gray.800", borderColor: "gray.700" }}
        _hover={{ boxShadow: "md", transform: "translateY(-2px)", transition: "all 0.2s" }}
      >
        <CardHeader pb={1} mb={0}>
          <Flex justify="space-between" align="center" w="100%">
            <HStack p={1}>
              {gpuData === null ? (
                <Status.Root colorPalette="orange"><Status.Indicator /></Status.Root>
              ) : gpuData?.error ? (
                <Status.Root colorPalette="red"><Status.Indicator /></Status.Root>
              ) : (
                <Status.Root colorPalette="green"><Status.Indicator /></Status.Root>
              )}
              <Heading size="md">{host}</Heading>
              <Image src={`/icons/${host}.gif`} boxSize="35px" alt="" />
            </HStack>
            <Badge colorPalette="pink">GPU</Badge>
          </Flex>
        </CardHeader>

        <Separator />

          <Card.Body pt={2} mb={3}>
            {/* GPU Section */}
            {
              !gpuData ? (
                <Spinner />
              ) : gpuData?.error ? (
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
                      {gpuData?.map((gpu) => (
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
              {lastUpdated || "—"}
            </Text>
          </Card.Body>
      </Card.Root>
    </Box>
  );
};

export default GPUCard;
