import { Box, useTheme } from "@mui/material";
import Header from "../../../components/admin/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../../theme";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Header title="FAQ" subtitle="Frequently Asked Questions Page" />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What is the Cat Dog Lover Platform?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The Cat Dog Lover Platform is a dedicated community for pet
            enthusiasts. Whether you're passionate about cats, dogs, or both,
            our platform brings together like-minded individuals to share
            experiences and connect.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How can I join the Cat Dog Lover Platform?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Joining the Cat Dog Lover Platform is easy! Simply visit our website
            and click on the "Join Now" button. Fill out the required
            information, create your profile, and start connecting with other
            pet lovers.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Can I share my pet stories on the platform?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Absolutely! We encourage all members to share their pet stories,
            photos, and experiences. It's a great way to connect with other
            members who have similar interests and create a vibrant community.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Are there specific communities for cat and dog lovers?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Yes, we have dedicated communities for both cat and dog lovers. You
            can join the community that aligns with your interests to connect
            with members who share your passion.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How can I find and connect with other pet enthusiasts?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            To find and connect with other pet enthusiasts, you can use our
            search feature to discover members with similar interests.
            Additionally, you can participate in discussions, events, and groups
            related to your favorite pets.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Is there a mobile app for the Cat Dog Lover Platform?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Yes, we have a mobile app available for both iOS and Android
            devices. You can download it from the App Store or Google Play to
            stay connected with the Cat Dog Lover community on the go.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FAQ;
