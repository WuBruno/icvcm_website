import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { Typography } from "@mui/material";

type Props<T> = {
  items: T[];
  keyExtractor: (item: T) => string;
  leftText: (item: T) => string;
  rightHeading: (item: T) => string;
  rightText: (item: T) => string;
  dotColor?: (item: T) => "success" | "error" | "grey" | "warning" | "info";
};

const ConstitutionTimeline = <T extends object>({
  items,
  keyExtractor,
  leftText,
  rightHeading,
  rightText,
  dotColor = () => "grey",
}: Props<T>) => {
  return (
    <Timeline>
      {items &&
        items.map((item, index) => {
          return (
            <TimelineItem key={keyExtractor(item)}>
              <TimelineOppositeContent
                sx={{ m: "auto 0" }}
                align="right"
                variant="body2"
                color="text.secondary"
              >
                {leftText(item)}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color={dotColor(item)} />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "12px", px: 2 }}>
                <Typography>Proposal: {rightHeading(item)}</Typography>
                <Typography variant="caption">{rightText(item)}</Typography>
              </TimelineContent>
            </TimelineItem>
          );
        })}
    </Timeline>
  );
};

export default ConstitutionTimeline;
