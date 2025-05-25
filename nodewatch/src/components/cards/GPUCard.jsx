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
import { useState } from "react";
import GPUSummary from "../summaries/GPUSummary";
import CPUSummary from "../summaries/CPUSummary";


const GPUCard = ({ host, gpuData, cpuData, lastUpdated, columnCount }) => {
  const [showCPU, setShowCPU] = useState(false);

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
            <Badge
              colorPalette="pink"
              cursor="pointer"
              onClick={() => setShowCPU((prev) => !prev)}
              _hover={{ opacity: 0.8 }}
            >
              {showCPU ? "CPU" : "GPU"}
            </Badge>
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
              ) : showCPU ? (
                <CPUSummary cpuData={cpuData} procColor={"hotpink"} />
              ): (
                <GPUSummary gpuData={gpuData}/>
              )}

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
