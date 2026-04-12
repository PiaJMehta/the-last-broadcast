import { useState, useEffect } from "react";



const SurvivalChances = () => {
    const [profile, setProfile] = useState({
        codename: "",
        skill: "",
        years: "",
        team: ""
    });

    const [chance, setChance] = useState(0);
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");

    const hints = ["CLUE_ST0R3D_1N_L0C4L", "CH3CK_L0C4L_ST0R4G3", "L00K_1NS1D3_L0C4L_M3M0RY"];

    const skills = ["FULL STACK", "HACKER", "DESIGNER", "ANALYST", "DATA SCIENTIST"];
    const teams = ["SOLO", "PAIR", "TRIO"];

    useEffect(() => {
        // When participants find this localStorage value and run atob() on it,
        // they will see "FRAGMENT_CHARLIE" — telling them this is the CHARLIE fragment
        // for the Signal terminal puzzle.
        const itemKey = "SYS_FRAGMENT_PROFILE";
        const itemValue = btoa(`FRAGMENT_CHARLIE::Add_who_you_claim_to_be`);
        localStorage.setItem(itemKey, itemValue);
    }, []);

    const calculateSurvival = () => {

        if(!profile.codename || !profile.skill || !profile.years || !profile.team){
            setMessage("ALL FIELDS ARE REQUIRED");
            return;
        }

        let score = 0;

        if (profile.skill === "HACKER") score += 30;
        else if (profile.skill === "FULL STACK") score += 25;
        else if (profile.skill === "ANALYST") score += 20;
        else score += 10;

        const years = parseInt(profile.years) || 0;
        score += Math.min(years * 5, 30);

        if (profile.team === "SOLO") score += 10;
        else if (profile.team === "PAIR") score += 20;
        else if (profile.team === "TRIO") score += 25;

        score = Math.min(score, 100);

        setChance(score);

        if (score < 30) setStatus("LIKELY DEAD");
        else if (score < 60) setStatus("SURVIVAL UNCERTAIN");
        else setStatus("HIGH SURVIVAL PROBABILITY");

        setMessage(hints[Math.floor(Math.random() * hints.length)]);
    };

    return(
        <>
            <div className="max-w-4xl mx-auto mt-12">
                <h2 className="text-xl tracking-widest mb-6 text-center font-bold">// CHECK SURVIVAL CHANCES</h2>
                <section className="p-6 max-w-4xl mx-auto border border-green-500/20 bg-black/60 backdrop-blur-md">

                    <h2 className="text-xl mb-6 tracking-widest">SUBJECT STATUS : UNKNOWN</h2>

                    {/* INPUT GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label>// Codename</label>
                            <input
                                className="w-full mt-1 border border-green-500/30 p-2"
                                type="text"
                                value={profile.codename}
                                onChange={(e) => setProfile({...profile, codename: e.target.value})}
                            />
                        </div>
                        <div>
                            <label>// Skill</label>
                            <select
                                className="w-full mt-1 border border-green-500/30 p-2"
                                value={profile.skill}
                                onChange={(e) => setProfile({...profile, skill: e.target.value})}
                            >
                                <option value="">Select</option>
                                {skills.map((s) => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label>// Years</label>
                            <input
                                className="w-full mt-1 border border-green-500/30 p-2"
                                type="number"
                                value={profile.years}
                                onChange={(e) => setProfile({...profile, years: e.target.value})}
                            />
                        </div>
                        <div>
                            <label>// Team</label>
                            <select
                                className="w-full mt-1 border border-green-500/30 p-2"
                                value={profile.team}
                                onChange={(e) => setProfile({...profile, team: e.target.value})}
                            >
                                <option value="">Select</option>
                                {teams.map((t) => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* BUTTON */}
                    <button
                        onClick={calculateSurvival}
                        className="mt-8 w-full bg-green-500 text-black py-2 tracking-widest hover:brightness-150 transition-all"
                    >
                        CALCULATE ODDS
                    </button>

                    {/* PROGRESS BAR */}
                    <div className="mt-8 relative">
                        <div className="h-2 bg-green-900/30">
                            <div
                                className="h-2 bg-green-500 transition-all duration-1000"
                                style={{ width: `${chance}%` }}
                            />
                        </div>

                        {/* Scan line effect */}
                        <div className="absolute left-0 w-full h-0.5 bg-green-500/40 animate-[scanHorizontal_4s_ease-in-out_infinite]" />
                    </div>

                    {/* RESULT */}
                    <div className="mt-10 flex justify-between items-end">
                        <div>
                            <p className="text-xs opacity-60">SURVIVAL PROBABILITY</p>
                            <h1 className="text-8xl font-black leading-none">{chance}%</h1>
                        </div>

                        <div className="text-right">
                            <p className="text-yellow-500 tracking-widest">{status}</p>
                        </div>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className="mt-8 p-4 border border-green-500/20 bg-green-500/5 text-xs tracking-widest animate-pulse font-extrabold">
                            {message}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}

export default SurvivalChances;