import { Box, Text } from '@chakra-ui/react';
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


const CPUSummary = ({ cpuData, procColor }) => {
  if (!cpuData) return null;

  const dataset = buildLoadDataset(cpuData.cpu_usage, cpuData.mem_usage, cpuData.total_mem);
  const allUsers = Object.keys(dataset[0]).filter((k) => k !== "id");

  const series = allUsers.map((name) => ({
    dataKey: name,
    label: name === "idle" ? "idle" : name,
    stack: "load",
    color: name === "idle" ? "#e3e5e6" : procColor,
  }));

  return (
    <Box height={180} width="100%" ml={0} pl={0}>
      <Box fontSize="2xs" color="gray.600" mr={0} mb={2}>
        <Text>
          <b>CPU:</b> {cpuData.n_cpus / 2} cores | {cpuData.n_cpus} threads
        </Text>
        <Text>
          <b>Total RAM:</b> {Math.round(cpuData.total_mem)} GB
        </Text>
      </Box>

      <BarChart
        dataset={dataset}
        borderRadius={6}
        layout="horizontal"
        series={series}
        sx={{ height: '100%', width: '100%' }}
        slotProps={{
          legend: {
            direction: 'vertical',
            sx: {
              overflowY: 'scroll',
              overflowX: 'scroll',
              flexWrap: 'nowrap',
              height: '100%',
            },
          },
        }}
        xAxis={[{
          max: 100,
          label: 'Load (%)',
          labelStyle: { fontSize: 11, fill: '#4A5568' },
          tickLabelStyle: { fontSize: 10, fill: '#4A5568', fontFamily: 'monospace' },
          axisLine: { stroke: '#A0AEC0' },
          tickLine: { stroke: '#CBD5E0' },
        }]}
        yAxis={[{
          dataKey: 'id',
          tickLabelStyle: { fontSize: 11, fill: '#2D3748' },
          axisLine: { stroke: '#A0AEC0' },
          tickLine: { stroke: '#CBD5E0' },
        }]}
        mt={2}
        height={180}
      />
    </Box>
  );
};

export default CPUSummary;
