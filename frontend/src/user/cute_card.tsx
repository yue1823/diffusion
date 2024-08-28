import React from 'react';

const styles = {
    container: {
        position: 'relative' as 'relative',
        margin: 'auto',
        overflow: 'hidden' as 'hidden',
        width: '700px',
        height: '250px',
    },
    successBox: {
        position: 'absolute' as 'absolute',
        width: '35%',
        height: '100%',
        left: '12%',
        background: 'linear-gradient(to bottom right, #B0DB7D 40%, #99DBB4 100%)',
        borderRadius: '20px',
        boxShadow: '5px 5px 20px rgba(203, 205, 211, 0.1)',
        perspective: '40px',
    },
    errorBox: {
        position: 'absolute' as 'absolute',
        width: '35%',
        height: '100%',
        right: '12%',
        background: 'linear-gradient(to bottom left, #EF8D9C 50%, #FFC39E 100%)',
        borderRadius: '20px',
        boxShadow: '5px 5px 20px rgba(203, 205, 211, 0.1)',
    },
    normalBox: {
        position: 'absolute' as 'absolute',
        width: '35%',
        height: '100%',
        left: '12%',
        background: 'linear-gradient(to bottom right, #A0E1DFE4 50%, #99DBB4 100%)',
        borderRadius: '20px',
        boxShadow: '5px 5px 20px rgba(203, 205, 211, 0.1)',
        perspective: '40px',
    },
    face: {
        position: 'absolute' as 'absolute',
        width: '22%',
        height: '22%',
        background: '#FCFCFC',
        borderRadius: '50%',
        border: '1px solid #777777',
        top: '21%',
        left: '37.5%',
        zIndex: 2 as 2,
        animation: 'bounce 1s ease-in infinite',
    },
    face2: {
        position: 'absolute' as 'absolute',
        width: '22%',
        height: '22%',
        background: '#FCFCFC',
        borderRadius: '50%',
        border: '1px solid #777777',
        top: '21%',
        left: '37.5%',
        zIndex: 2 as 2,
        animation: 'roll 3s ease-in-out infinite',
    },
    eye: {
        position: 'absolute' as 'absolute',
        width: '5px',
        height: '5px',
        background: '#777777',
        borderRadius: '50%',
        top: '40%',
        left: '20%',
    },
    normal_eye:{
        position: 'absolute' as 'absolute',
        width: '15px',
        height: '2px',
        background: '#777777',
        borderRadius: '30%',
        top: '40%',
        left: '15%',
    },
    normal_rightEye: {
        left: '60%',
    },
    rightEye: {
        left: '68%',
    },
    mouth: {
        position: 'absolute' as 'absolute',
        top: '43%',
        left: '41%',
        width: '7px',
        height: '7px',
        borderRadius: '50%',
    },
    happyMouth: {
        border: '2px solid',
        borderColor: 'transparent #777777 #777777 transparent',
        transform: 'rotate(45deg)',
    },
    sadMouth: {
        top: '49%',
        border: '2px solid',
        borderColor: '#777777 transparent transparent #777777',
        transform: 'rotate(45deg)',
    },
    normalMouth: {
        top: '60%',
        border: '2px solid',
        borderColor: '#777777 transparent transparent #777777',
        transform: 'rotate(45deg)',
        left:22.5
    },
    shadow: {
        position: 'absolute' as 'absolute',
        width: '21%',
        height: '3%',
        opacity: 0.5,
        background: '#777777',
        left: '40%',
        top: '43%',
        borderRadius: '50%',
        zIndex: 1 as 1,
    },
    scale: {
        animation: 'scale 1s ease-in infinite',
    },
    move: {
        animation: 'move 3s ease-in-out infinite',
    },
    message: {
        position: 'absolute' as 'absolute',
        width: '100%',
        textAlign: 'center' as 'center',
        height: '100%',
        top: '47%',
    },
    alert: {
        fontSize: 35,
        fontWeight: 100,
        fontsize:"150%",
        letterSpacing: '3px',
        paddingTop: '5px',
        color: '#FCFCFC',
        paddingBottom: '5px',
        textTransform: 'uppercase' as 'uppercase',
    },
    buttonBox: {
        position: 'absolute' as 'absolute',
        background: 'rgba(160,225,223,0.7)',
        width: '50%',
        height: '15%',
        borderRadius: '20px',
        top: '73%',
        left: '25%',
        outline: '0',
        border: 'none',
        boxShadow: '2px 2px 10px rgba(119, 119, 119, 0.7)',
        transition: 'all .5s ease-in-out',
        cursor: 'pointer',
    },
    buttonHover: {
        background: '#EDEDED',
        transform: 'scale(1.05)',
        transition: 'all .3s ease-in-out',
    },
};

const SuccessBox: React.FC <{price:string}>= ({price}) => (
    <div style={styles.successBox}>
        <div style={styles.face}>
            <div style={styles.eye}></div>
            <div style={{ ...styles.eye, ...styles.rightEye }}></div>
            <div style={{ ...styles.mouth, ...styles.happyMouth }}></div>
        </div>
        <div style={{ ...styles.shadow, ...styles.scale }}></div>
        <div style={styles.message}><h1 style={styles.alert}>Right!</h1></div>
        <div style={{
            position: "absolute",
            fontWeight: 100,
            letterSpacing: '3px',
            paddingTop: '5px',
            color: '#FCFCFC',
            paddingBottom: '5px', textTransform: 'uppercase' as 'uppercase', fontSize: 20, top: 190, left: 30
        }}>Price : <span style={{width: "auto"}}>{price}</span> APT</div>
    </div>

);

const ErrorBox: React.FC = () => (
    <div style={styles.errorBox}>
        <div style={styles.face2}>
            <div style={styles.eye}></div>
            <div style={{ ...styles.eye, ...styles.rightEye }}></div>
            <div style={{ ...styles.mouth, ...styles.sadMouth }}></div>
        </div>
        <div style={{ ...styles.shadow, ...styles.move }}></div>
        <div style={styles.message}><h1 style={styles.alert}>Wrong!</h1></div>
    </div>
);
const ExpiredBox: React.FC = () => (
    <div style={styles.normalBox}>
        <div style={styles.face2}>
            <div style={styles.normal_eye}></div>
            <div style={{ ...styles.normal_eye, ...styles.normal_rightEye }}></div>
            <div style={{ ...styles.mouth, ...styles.normalMouth }}></div>
        </div>
        <div style={{ ...styles.shadow, ...styles.move }}></div>
        <div style={styles.message}><h1 style={styles.alert}>I dont know!</h1></div>
    </div>
);

const NotificationBoxes: React.FC <{right:boolean,price:string,expire_or_not:boolean}>= ({right,price,expire_or_not}) => {
    return (
        <div style={styles.container}>
            {expire_or_not ? <>
                {right && ( <SuccessBox price={price}/>)}
                {!right && ( <ErrorBox />)}
            </> : <>
            <ExpiredBox/>
            </>}
        </div>
    );
};

export default NotificationBoxes;
