import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import './QnaAccordion.css';

function QnaAccordion({ data, index, handleChange, isExpanded  }) {
  
    return (
        <Accordion key={index} expanded={isExpanded} onChange={handleChange(data.qnaId)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3bh-content" id="panel3bh-header">
                <Typography component="span" sx={{ width: '33%', flexShrink: 0 }}>
                    {data.seller}
                </Typography>
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                    {data.content}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    {data.replyContent}
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
}

export default QnaAccordion;
