import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
} from '@chakra-ui/react'


function Help() {
    return (
        <Accordion allowToggle>
            <AccordionItem>
                <h2>
                    <AccordionButton>
                        <Box flex='1' textAlign='left'>
                            Help
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel textAlign='left'>
                    <p>Use this interface to discover GitHub's implicit social graph.</p>
                    <p><strong>Search</strong> for two GH users using the two text boxes to find the shortest path between.</p>
                    <p><strong>Click</strong> on a node to see more details on the side panel and expand it one level to its neighbours.</p>
                    <p>Optionally sign in to GitHub to allow more API calls for the side panel.</p>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
}

export default Help
