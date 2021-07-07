import React, { useState, useEffect } from "react";
import { useComponentState, useProvider } from "../../hooks";
import { Container, makeStyles, Grid } from "@material-ui/core";
import FiltersArea from "../../components/FiltersArea";
import { fetchData } from './helpers';
import GameCardAdmin from '../../components/GameCardAdmin/index';

const useStyles = makeStyles(() => ({
    gradient: {
        backgroundImage: "linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%)",
        top: "4rem",
        position: "relative",
        minHeight: "87vh",
        paddingTop: 24,
        paddingBottom: 24
    },
    gameContainer: {
        paddingTop: 16,
    },
}));

const Admin = () => {
    const classes = useStyles();
    const { state, setState, ErrorPage, LoadingAnimation } = useComponentState();
    const { provider, /*setProvider,*/ accounts /*setAccounts*/ } = useProvider();
    const [isFilterGameToActive, setFilterGameToActive] = useState(true);
    const [competition, setCompetition] = useState(null)
    const [competitions, setCompetitions] = useState(null);
    const [games, setGames] = useState(null);

    useEffect(() => {

        const fetchAndSetCompetitions = async () => {
            try {
                setState({ status: "loading", code: null });
                const _competitions = await fetchData("/competitions")
                setCompetitions(_competitions);
                setCompetition(_competitions[0])
            } catch (error) {
                console.log(error)
                setState({ status: "error", code: 500 });
            }

        }
        fetchAndSetCompetitions()

    }, [provider, accounts]);


    useEffect(() => {
        const fetchAndSetGames = async (competition) => {
            try {
                setState({ status: "loading", code: null });
                const _games = await fetchData(`/competitions/${competition.id}/games`)
                setGames(_games);
                setState({ status: "loaded", code: null });
            } catch (error) {
                console.log(error)
                setState({ status: "error", code: 500 });
            }

        }
        competition && fetchAndSetGames(competition)

    }, [competition])



    if (state.status === "loading") return <LoadingAnimation />;
    else if (state.status === "loaded")
        return (
            <div className={classes.gradient}>
                <Container maxWidth="lg">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FiltersArea
                                competition={competition}
                                competitions={competitions}
                                setCompetition={(selectedCompetition) =>
                                    setCompetition(selectedCompetition)
                                }
                                isFilterGameToActive={isFilterGameToActive}
                                setFilterGameToActive={(value) => setFilterGameToActive(value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2} className={classes.gameContainer}>
                                {games?.length > 0 ? (
                                    games.map((game) => (
                                        <Grid item xs={12} lg={4} key={game.id}>
                                            <GameCardAdmin
                                                competition={competition}
                                                provider={provider}
                                                accounts={accounts}
                                                game={game}
                                            />
                                        </Grid>
                                    ))
                                ) : (
                                    <ErrorPage code={404} height="100%" messageDisplayed={false} />
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        );
    else {
        return <ErrorPage code={state.code} height="90vh" />;
    }
};

export default Admin;
