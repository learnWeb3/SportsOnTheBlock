import React from 'react';
import imagePlaceholder from './src/image_placeholder.png';
import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(() => ({
    rounded: {
        borderRadius: 8
    },
    rounded0: {
        borderRadius: 0
    }
}))

const ImagePlaceholder = ({ rounded, height, width }) => {
    const classes = useStyles();
    return <img className={rounded ? classes.rounded : classes.rounded0} src={imagePlaceholder} height={height} width={width} alt="image not loaded" />;
}

export default ImagePlaceholder;