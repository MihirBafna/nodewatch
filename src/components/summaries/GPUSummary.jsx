import {
  Table,
  Box,
} from "@chakra-ui/react";


function getGPURowColor(gpu) {
  const util = gpu["utilization.gpu"];
  const memUsed = gpu["memory.used"];
  if (util > 75) return "#a50000";
  if (util > 0) return "#a05000";
  if (util === 0 && memUsed > 1024) return "#ff00b5";
  return "#076301";
}


const GPUSummary = ({gpuData}) => {

    return (
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
    );
};

export default GPUSummary