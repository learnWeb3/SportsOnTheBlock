import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  description: {
    marginTop: 16,
  },
}));

const GameDescriptionPanel = ({ description }) => {
  const classes = useStyles();
  return (
    <>
      <Typography variant="h6" component="p">
        Description :
      </Typography>
      <Typography className={classes.description} paragraph>
        {description}
      </Typography>
    </>
  );
};

export default GameDescriptionPanel;
