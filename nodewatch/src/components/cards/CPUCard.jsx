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
} from "@chakra-ui/react";

import Tooltip from '@mui/material/Tooltip';

import { BarChart } from '@mui/x-charts/BarChart';
import CPUSummary from "../summaries/CPUSummary";


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
            <Tooltip
              title={
                <>
                  <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                    <b>Host:</b> {host}@csail.mit.edu<br />
                  </div>
                </>
              }
              arrow
              placement="top"
              cursor="pointer"
            >
            <HStack p={1}>
              <Status.Root colorPalette="green">
                <Status.Indicator />
              </Status.Root>
              <Heading size="md">{host}</Heading>
              <Image src={`/icons/${host}.gif`} boxSize="35px" alt="" />
            </HStack>
            </Tooltip>
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

          {cpuData && (<CPUSummary cpuData={cpuData} procColor={"#00bcd4"} />)}

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
