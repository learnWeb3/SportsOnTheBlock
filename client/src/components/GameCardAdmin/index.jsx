import React, { useState, useEffect } from "react";
import { useComponentState, useFavorites, useMediaLoaded } from "../../hooks";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import { CardMedia } from "@material-ui/core";
import capitalize from "capitalize";
import CardActionBar from "../CardActionBar";
import GameCardCollapse from "../GameCard/GameCardCollapse/index";
import GameCardHeader from "../GameCard/GameCardHeader/index";
import GameCardContent from "../GameCard/GameCardContent/index";
import ImagePlaceholder from "../icons/ImagePlaceholder";

const useStyles = makeStyles((theme) => ({
    root: {
        textAlign: "left",
        padding: 16,
        justifyContent: "space-between",
        "& h5": {
            fontWeight: 700,
        },
    },
    media: {
        padding: "1rem",
        margin: "auto",
        width: "unset"
    },
    expand: {
        transform: "rotate(0deg)",
        marginLeft: "auto",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: "rotate(180deg)",
    },
    gameName: {
        marginBottom: 8,
    },
}));

const GameCardAdmin = ({
    competition,
    accounts,
    game: {
        team1Logo: cover,
        description,
        ended,
        started,
        team1Name,
        team1Score,
        team2Name,
        team2Score,
        winner,
        start,
        id,
    },
}) => {
    const classes = useStyles();
    // access component hooks to deal with favorites actions
    const {
        favorites,
        setFavorites,
        isFavorite,
        handleAddFavorite
    } = useFavorites(id)
    // access component hook to check wether image is loaded 
    const { media, mediaLoaded } = useMediaLoaded()

    // Access custom hooks to display errors and loading animations
    const {
        state,
        setState,
        ErrorComponent,
        LoadingAnimation,
        isModalToogled,
        setModalToogled,
    } = useComponentState();

    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    if (state.status === "loading") return <LoadingAnimation />;
    else {
        console.log(cover)
        return (
            <Card className={classes.root}>
                {state.status === "loaded" ? (
                    <>
                        <GameCardHeader
                            game={{
                                cover,
                                description,
                                ended,
                                started,
                                team1Name,
                                team1Score,
                                team2Name,
                                team2Score,
                                winner,
                                start,
                                id,
                            }}
                            competition={competition}
                        />
                        {
                            mediaLoaded ? (
                                <CardMedia
                                    ref={media}
                                    src={cover}
                                    component="img"
                                    className={classes.media}
                                    title={`${capitalize(team1Name)} vs ${capitalize(team2Name)}`}
                                />
                            ) : <ImagePlaceholder rounded={true} height={"100%"} width={"100%"} />
                        }
                        <GameCardContent
                            game={{
                                cover,
                                description,
                                ended,
                                started,
                                team1Name,
                                team1Score,
                                team2Name,
                                team2Score,
                                winner,
                                start,
                                id,
                            }}
                        />
                        <CardActionBar
                            handleAddFavorite={handleAddFavorite}
                            isFavorite={isFavorite}
                            handleExpandClick={handleExpandClick}
                            expanded={expanded}
                            gameId={id}
                        />
                        <GameCardCollapse
                            expanded={expanded}
                            setModalToogled={setModalToogled}
                            game={{
                                cover,
                                description,
                                ended,
                                started,
                                team1Name,
                                team1Score,
                                team2Name,
                                team2Score,
                                winner,
                                start,
                                id,
                            }}
                        />
                    </>
                ) : (
                    state.status === "error" && <ErrorComponent />
                )}
            </Card>
        );
    }
};

export default GameCardAdmin;
