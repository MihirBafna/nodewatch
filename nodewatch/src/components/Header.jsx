import {
  Box,
  HStack,
  Heading,
  Text,
  Slider,
  Image,
} from "@chakra-ui/react";

function Header({ columnCount, setColumnCount }) {
  return (
    <HStack justify="space-between" w="100%" px={2}>
      <HStack>
        <Heading mb={0} fontSize="2xl">
          nodeWatch
        </Heading>
        <Image src={`/icons/nodewatcher.gif`} boxSize="40px" alt="nodewatch logo" />
      </HStack>

      <HStack spacing={2}>
        <Text fontSize="sm">Cols: {columnCount}</Text>
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
              <Slider.Thumb index={0} cursor="pointer" />
            </Slider.Control>
          </Slider.Root>
        </Box>
      </HStack>
    </HStack>
  );
}

export default Header;
