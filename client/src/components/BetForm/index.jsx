import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { server_root_path } from "../../config/index.json";
import { useComponentState } from "../../hooks";
import SnackBar from "../SnackBar.index";
import ModalClosePanel from "../ModalClosePanel/index";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import clsx from "clsx";
import capitalize from "capitalize";
import {
  Grid,
  makeStyles,
  TextField,
  Typography,
  Button,
  Hidden,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {},
  containerFlex: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  textfield: {
    marginTop: "1rem",
    marginBottom: "1rem",
    width: "100%",
  },
  button: {
    marginTop: "1rem",
    width: "100%",
  },
  formLg: {
    borderRadius: "4px",
  },
  form: {
    padding: 24,
    minHeight: "100%",
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#FFF",
  },
  formContainerSm: {
    minHeight: "100%",
    top: "4rem",
    position: "relative",
  },
  title: {
    marginBottom: "1rem",
  },
  backPanel: {
    display: "flex",
    alignItems: "center",
  },
  backArrow: {
    marginBottom: 24,
    marginRight: 8,
    cursor: "pointer",
  },
  media: {
    width: "100%",
  },
  formControl: {
    width: "100%",
  },
  formLabel: {
    paddingTop: "1rem",
  },
}));

const BetForm = ({
  title,
  buttonLabel,
  setModalToogled,
  bettingContract,
  accounts,
  game: {
    cover,
    description,
    ended,
    started,
    team1Name,
    team1Score,
    team2Name,
    team2Score,
    winner,
    id,
  },
}) => {
  const { alert, setAlert } = useComponentState();
  const matches = useMediaQuery("(max-width:600px)");
  const classes = useStyles();
  const [formData, setFormData] = useState({
    betSide: {
      value: "",
      helperText: "",
      error: false,
    },
    betValue: {
      value: "",
      error: false,
    },
    isValid: false,
  });
  const validateFields = (event) => {
    fields.map((field) => {
      if (event.target.name === field.name) {
        const newFormData = {
          ...formData,
          [field.name]: {
            value: event.target.value,
            error: event.target.value === "",
            helperText: "Required",
          },
        };
        let formIsValid = true;
        for (const key in newFormData) {
          if (newFormData[key].value === "") {
            formIsValid = false;
          }
        }
        setFormData({ ...newFormData, isValid: formIsValid });
      }
    });
  };

  useEffect(() => {
    setAlert({
      toogled: true,
      message: "Please fill out the form to place your bet",
      type: "info",
    });
  }, []);

  const fields = [
    {
      label: "choose your side",
      type: "select",
      labelId: "Choose your side",
      id: "betSide",
      name: "betSide",
      value: "",
      items: [
        { id: 1, name: team1Name?.toUpperCase(), disabled: false },
        { id: 0, name: "NULL", disabled: false },
        { id: 2, name: team2Name?.toUpperCase(), disabled: false },
      ],
      onChange: (event) => {
        validateFields(event);
      },
      required: true,
    },
    {
      type: "number",
      error: "",
      required: true,
      readOnly: false,
      helperText: "",
      label: "Bet amount",
      id: "betValue",
      name: "betValue",
      onInput: (event) => {
        validateFields(event);
      },
    },
  ];

  const handleSubmit = async () => {
    if (formData.isValid) {
      try {
        await bettingContract.methods
          .bet(id, formData.betSide.value)
          .send({
            from: accounts[0],
            value: bettingContract.utils.toWei(
              formData.betValue.value.toString()
            ),
          });
        setAlert({
          toogled: true,
          message:
            "Your bet has been sent to the contract ! Have Game and may the odds be ever in your favor",
          type: "success",
        });
      } catch (error) {
        setAlert({
          toogled: true,
          message: "We encoutered an unexpected error, please try again",
          type: "error",
        });
      }
    } else {
      setAlert({
        toogled: true,
        message: "form is invalid, please fill the required inputs",
        type: "error",
      });
    }
  };

  return (
    <>
      <Grid container className={classes.root}>
        <Hidden mdDown>
          <Grid item lg={4}></Grid>
        </Hidden>
        <Grid item xs={12} lg={4} className={classes.containerFlex}>
          <div
            className={
              matches
                ? clsx(classes.formContainer, classes.formContainerSm)
                : classes.formContainer
            }
          >
            <img
              src={server_root_path + cover}
              alt=""
              className={classes.media}
            />
            <form
              noValidate
              autoComplete="off"
              className={
                matches ? classes.form : clsx(classes.form, classes.formLg)
              }
            >
              <ModalClosePanel setModalToogled={setModalToogled} />
              <Typography variant="h4" component="h1" className={classes.title}>
                {title} {capitalize(team1Name)} vs {capitalize(team2Name)}
              </Typography>
              {fields.map((field) =>
                field.type === "number" ? (
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    key={field.id}
                  >
                    <TextField
                      id={field.id}
                      variant="outlined"
                      className={classes.textfield}
                      required={field.required}
                      readOnly={field.readOnly}
                      error={formData[field.id].error}
                      helperText={formData[field.id].helperText}
                      type={field.type}
                      value={formData[field.id].value}
                      onInput={field.onInput}
                      name={field.name}
                      label={field.label}
                    />
                  </FormControl>
                ) : (
                  field.type === "select" && (
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                      key={field.id}
                    >
                      <InputLabel htmlFor={field.labelId}>
                        {capitalize(field.label)}
                      </InputLabel>
                      <Select
                        labelId={field.labelId}
                        id={field.id}
                        name={field.name}
                        value={formData[field.id].value}
                        onChange={field.onChange}
                        className={classes.textfield}
                        error={formData[field.id].error}
                      >
                        {field.items?.map((item) => (
                          <MenuItem
                            key={`game-${item.id}`}
                            key={item.id}
                            value={item.id}
                            disabled={item.disabled}
                          >
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )
                )
              )}
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                size="large"
                onClick={handleSubmit}
                disabled={!formData.isValid}
              >
                {buttonLabel}
              </Button>
            </form>
          </div>
        </Grid>

        <Hidden mdDown>
          <Grid item lg={4}></Grid>
        </Hidden>
      </Grid>

      {alert.toogled &&
        ReactDOM.createPortal(
          <SnackBar
            message={alert.message}
            type={alert.type}
            setAlert={setAlert}
          />,
          document.querySelector("body")
        )}
    </>
  );
};

export default BetForm;
