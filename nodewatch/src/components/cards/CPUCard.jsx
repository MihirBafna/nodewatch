import {
  Card,
  CardHeader,
  CardBody,
  Box,
  Flex,
  HStack,
  Heading,
  Spinner,
  Image,
  Text,
  Badge,
  Separator,
  Status,
  Stat,
  FormatByte,
} from "@chakra-ui/react";
import { BarChart } from '@mui/x-charts/BarChart';


function buildLoadDataset(cpuUsage = {}, memUsage = {}, totalMem = 1) {
  const allUsers = new Set([
    ...Object.keys(cpuUsage || {}),
    ...Object.keys(memUsage || {}),
  ]);

  const activeUsers = Array.from(allUsers).filter((user) => {
    const cpu = cpuUsage[user] || 0;
    const mem = memUsage[user] || 0;
    
    return cpu > 0 || mem > 0;
  });

  const cpuEntries = activeUsers.map((user) => [
    user,
    +(cpuUsage[user] || 0).toFixed(2),
  ]);
  const cpuTotal = cpuEntries.reduce((acc, [_, val]) => acc + val, 0);
  const cpuIdle = +(Math.max(0, 100 - cpuTotal).toFixed(2));

  const memEntries = activeUsers.map((user) => [
    user,
    +(((memUsage[user] || 0) / totalMem) * 100).toFixed(2),
  ]);
  const memTotal = memEntries.reduce((acc, [_, val]) => acc + val, 0);
  const memIdle = +(Math.max(0, 100 - memTotal).toFixed(2));

  return [
    {
      id: 'CPU',
      ...Object.fromEntries(cpuEntries),
      idle: cpuIdle,
    },
    {
      id: 'RAM',
      ...Object.fromEntries(memEntries),
      idle: memIdle,
    },
  ];
}



const CPUCard = ({ host, cpuData, lastUpdated, columnCount }) => {


  return (
    <Box >
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
              <Status.Root colorPalette="green">
                <Status.Indicator />
              </Status.Root>
              <Heading size="md">{host}</Heading>
              <Image src={`/icons/${host}.gif`} boxSize="35px" alt="" />
            </HStack>
            <Badge colorPalette="cyan">CPU</Badge>
          </Flex>
        </CardHeader>

        <Separator />

        <CardBody pt={2} mb={3}>

        {!cpuData ? (
              <Spinner />
            ) : (
            <Box pl={2} pr={5} mt={3}>
              {/* <Flex fontSize="xs" fontWeight="semibold" mb={1} gap={4}>
                <Text whiteSpace="nowrap">CPU ({cpuData.n_cpus} CORES)</Text>
                <Text>{sumCPU(cpuData.cpu_usage).toFixed(0)}%</Text>
                <Text>
                  {sumMem(cpuData.mem_usage).toFixed(0)} / {cpuData.total_mem.toFixed(0)} (GB)
                </Text>
              </Flex>

              {Object.keys(cpuData.cpu_usage)
                .filter((name) => cpuData.cpu_usage[name] > 0 || cpuData.mem_usage[name] > 0)
                .map((name) => (
                  <Flex key={name} fontSize="2xs" gap={4}>
                    <Text w="80px" isTruncated>{name}</Text>
                    <Text>{cpuData.cpu_usage[name].toFixed(0)}%</Text>
                    <Text>
                      {cpuData.mem_usage[name].toFixed(1)} / {cpuData.total_mem.toFixed(1)} (GB)
                    </Text>
                  </Flex>
                ))} */}

{cpuData && (
  <Box height={180} width={"100%"} ml={0} pl={0}>
  <Box  fontSize="2xs" color="gray.600" mr={0}>
    <Text><b>CPU:</b> {cpuData.n_cpus/2} cores | {cpuData.n_cpus} threads</Text>
    <Text><b>Total RAM:</b> {Math.round(cpuData.total_mem)} GB</Text>
  </Box> 
    {(() => {
      const dataset = buildLoadDataset(cpuData.cpu_usage, cpuData.mem_usage, cpuData.total_mem);
      const allUsers = Object.keys(dataset[0]).filter((k) => k !== "id");

      const series = allUsers.map((name) => ({
        dataKey: name,
        label: name === "idle" ? "idle" : name,
        stack: "load",
        color: name === "idle" ? "#e3e5e6" : "#00bcd4",
      }));

      return (
        <BarChart
          dataset={dataset}
          borderRadius={6}
          layout="horizontal"
          series={series}
          sx={{
            height: '100%',
            width: '100%',
          }}
          slotProps={{
            legend: {
              direction: 'vertical',
              sx: {
                overflowY: 'scroll',
                overflowX: 'scroll',
                flexWrap: 'nowrap',
                height: "100%"
              },
            },
          }}
          xAxis={[{
            max: 100,
            label: 'Load (%)',
            labelStyle: {
              fontSize: 11,         
              fill: '#4A5568',
            },
            fill: '#4A5568', 
            tickLabelStyle: {
              fontSize: 10,
              fill: '#4A5568', 
              fontFamily: 'monospace',
            },
            axisLine: { stroke: '#A0AEC0' }, 
            tickLine: { stroke: '#CBD5E0' }, 
          }]}
          yAxis={[{
            dataKey: 'id',
            label: '',
            tickLabelStyle: {
              fontSize: 11,
              fill: '#2D3748', 
            },
            axisLine: { stroke: '#A0AEC0' },
            tickLine: { stroke: '#CBD5E0' },
          }]}
          mt={2}
          height={180}
        />
      );
    })()}
  </Box>
  

)}


            </Box>
          )}

          <Text
            fontSize="2xs"
            color="gray.500"
            position="absolute"
            bottom="10px"
            right="25px"
          >
            {lastUpdated || "—"}
          </Text>
        </CardBody>
      </Card.Root>
    </Box>
  );
};

export default CPUCard;
