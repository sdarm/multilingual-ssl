(async function () {
    const queryParams = new URLSearchParams(window.location.search);
    const year = queryParams.get('year');
    const quarter = queryParams.get('quarter');
    const languages = queryParams.getAll('lang');
    const lessonNo = (queryParams.get('lesson') - 1) || 0

    const langConfig = await fetch("https://app.sdarm.org/sbl/conf/lang-config.json").then(res => res.json());
    if (languages.some(c => !langConfig.defaultBiblePerLang[c])) {
        alert("One of the selected languages is not supported.");
    }

    const sources = await Promise.all(languages.map(async cLang => {
        // https://app.sdarm.org/sbl/data/ro/ro-2025-3.json
        return {
            lang: cLang,
            source: await fetch(`https://app.sdarm.org/sbl/data/${cLang}/${cLang}-${year}-${quarter}.json`).then(res => {
                if (!res.ok) throw new Error(`Failed to load data for ${cLang}`);
                return res.json()
            })
        }
    }))

    const $result = $(".result")
    const firstLangSourceLesson = sources[0].source.lessons[lessonNo];

    // Header
    const $header = $("<div>", { class: "header lang-wrapper" });
    $result.append($header);
    for (const { lang, source } of sources) {
        const lesson = source.lessons[lessonNo];
        const $lang = $("<div>", { class: "language-block", "data-lang": lang });
        $header.append($lang);
        $lang.append($("<h2>", { text: lesson.header }));
        $lang.append($("<h3>", { text: lesson.dateLong }));
    }

    // Title
    const $title = $("<div>", { class: "title lang-wrapper" });
    $result.append($title);
    for (const { lang, source } of sources) {
        const lesson = source.lessons[lessonNo];
        const $lang = $("<div>", { class: "language-block", "data-lang": lang });
        $title.append($lang);
        $lang.append($("<h1>", { text: lesson.title }));
    }

    // Memory verse
    const $keyText = $("<div>", { class: "key-text lang-wrapper" });
    $result.append($keyText);
    for (const { lang, source } of sources) {
        const lesson = source.lessons[lessonNo];
        const $lang = $("<div>", { class: "language-block", "data-lang": lang });
        $keyText.append($lang);
        const $p = $("<p>", { text: lesson.keyText.text });
        $lang.append($p);
    }

    // Key note
    const $keyNote = $("<div>", { class: "key-note lang-wrapper" });
    $result.append($keyNote);
    for (const { lang, source } of sources) {
        const lesson = source.lessons[lessonNo];
        const $lang = $("<div>", { class: "language-block", "data-lang": lang });
        $keyNote.append($lang);
        const $p = $("<p>", { text: lesson.keyNote.text });
        $lang.append($p);
    }

    // Recommanded reading
    const $reading = $("<div>", { class: "reading lang-wrapper" });
    $result.append($reading);
    for (const { lang, source } of sources) {
        const lesson = source.lessons[lessonNo];
        const $lang = $("<div>", { class: "language-block", "data-lang": lang });
        $reading.append($lang);
        $lang.append($("<h3>", { text: lesson.reading.label }));
        const $ul = $("<ul>");
        for (const rec of lesson.reading.reading) {
            $ul.append($("<li>", { html: rec.label }));
        }
        $lang.append($ul);
    }

    // Daily lessons
    for (let dailyLessonIndex = 0; dailyLessonIndex < firstLangSourceLesson.dailyLessons.length; dailyLessonIndex++) {

        const dailyLesson = firstLangSourceLesson.dailyLessons[dailyLessonIndex];
        // Section title
        const $sectionTitle = $("<div>", { class: "section-title lang-wrapper" });
        $result.append($sectionTitle);
        for (const { lang, source } of sources) {
            const lesson = source.lessons[lessonNo];
            const dailyLesson = lesson.dailyLessons[dailyLessonIndex];
            const $lang = $("<div>", { class: "language-block", "data-lang": lang });
            $sectionTitle.append($lang);
            $lang.append($("<h2>", { text: dailyLesson.sectionTitle }));
        }

        // Subsections
        for (let subsectionIndex = 0; subsectionIndex < firstLangSourceLesson.dailyLessons[dailyLessonIndex].subsections.length; subsectionIndex++) {
            const subsection = firstLangSourceLesson.dailyLessons[dailyLessonIndex].subsections[subsectionIndex];
            for (let questionIndex = 0; questionIndex < subsection.q.length; questionIndex++) {
                // Question
                const $qWrapper = $("<div>", { class: "question lang-wrapper" });
                $result.append($qWrapper);
                for (const { lang, source } of sources) {
                    const lesson = source.lessons[lessonNo];
                    const dailyLesson = lesson.dailyLessons[dailyLessonIndex];
                    const subsection = dailyLesson.subsections[subsectionIndex];
                    let question = subsection.q[questionIndex];
                    if (!question?.text) {
                        question = { text: "" };
                    }
                    if (question.text.trim() === "") continue;
                    const $lang = $("<div>", { class: "language-block", "data-lang": lang });
                    $qWrapper.append($lang);
                    $lang.append($("<p>", { text: question.text }));
                    if (question.sOsis) {
                        try {
                            const bibleLink = `https://api.sbl.sdarm.org/bible-data/osis/${question.sOsis}/version-id/${langConfig.defaultBiblePerLang[lang] || langConfig.defaultBiblePerLang['en']}`;
                            const content = await fetch(bibleLink).then(res => res.json());
                            const verseIndexes = question.sOsis.replace(/([^\d.])/gi, "").split(".")
                            let range = {
                                start: 0,
                                end: 0,
                            }
                            if (verseIndexes.length === 5) {
                                range.start = verseIndexes[2] - 1
                                range.end = verseIndexes[4] - 1
                            } else if (verseIndexes.length === 3) {
                                range.start = verseIndexes[2] - 1
                                range.end = verseIndexes[2] - 1
                            } else {
                                debugger
                            }

                            const verses = content.slice(range.start, range.end + 1).join("<br>");
                            $lang.append($("<div>", { class: "bible-verses", html: verses }));
                        } catch (e) {
                            console.error("Failed to load verse for", question.sOsis, lang, e);
                            $lang.append($("<div>", { class: "bible-verses error", text: "Failed to load verse." }));
                        }
                    }
                }
            }

            // Note 
            const $noteWrapper = $("<div>", { class: "question-note lang-wrapper" });
            for (let noteIndex = 0; noteIndex < subsection.note.length; noteIndex++) {
                const $noteWrapper = $("<div>", { class: "question-note lang-wrapper" });
                $result.append($noteWrapper);
                for (const { lang, source } of sources) {
                    const lesson = source.lessons[lessonNo];
                    const dailyLesson = lesson.dailyLessons[dailyLessonIndex];
                    const subsection = dailyLesson.subsections[subsectionIndex];
                    let note = subsection.note[noteIndex];
                    if (!note?.text || note?.text?.trim() === "") {
                        note = { text: "" };
                    }
                    const $lang = $("<div>", { class: "language-block", "data-lang": lang });
                    $noteWrapper.append($lang);
                    let noteText = note.text;
                    if (note.sop) {
                        noteText += ` <a href="https://www.sdarm.org/sop/${note.sop.ref.replace("/", "-").toLowerCase()}" target="_blank">${note.sop.label}</a>`;
                    }
                    $lang.append($("<p>", { html: noteText }));
                }
            }
        }

        if (dailyLesson?.reviewQuestions?.length) {
            for (let reviewQuestionIndex = 0; reviewQuestionIndex < dailyLesson.reviewQuestions.length; reviewQuestionIndex++) {
                const $reviewQWrapper = $("<div>", { class: "review-question lang-wrapper" });
                $result.append($reviewQWrapper);
                for (const { lang, source } of sources) {
                    const lesson = source.lessons[lessonNo];
                    const dailyLesson = lesson.dailyLessons[dailyLessonIndex];
                    const reviewQuestion = dailyLesson.reviewQuestions[reviewQuestionIndex];
                    if (reviewQuestion.trim() === "") continue;
                    const $lang = $("<div>", { class: "language-block", "data-lang": lang });
                    $reviewQWrapper.append($lang);
                    $lang.append($("<p>", { text: reviewQuestion }));
                }
            }
        }
    }

    // https://api.sbl.sdarm.org/bible-data/osis/John.1.42/version-id/ro-vdc

    /*{
        "subsections": [
    {
        "date": "20250704",
        "dayLong": "Vineri",
        "monthDay": ", 4 iulie",
        "sectionTitle": "ÎNTREBĂRI DE REVIZUIRIE PERSONALĂ ",
        "subsections": [],
        "reviewQuestions": [
            "1. În umblarea mea cu Dumnezeu, cum pot cultiva cele mai bune calități ale Mariei?",
            "2. Ce avertizare ar trebui să iau [în considerare] observând atitudinea lui Iuda la ospăț?",
            "3. Cum pot evita capcana în care l-au condus pe Simon gândurile sale?",
            "4. Când se pot aplica în viața mea cuvintele de mângâiere ale lui Hristos pentru Maria?",
            "5. Ce ar trebui să învăț din modul în care Isus l-a convins pe Simon de greșeala sa?"
        ]
    }
],
"fso": {
    "title": "Darul Sabatului Întâi",
    "writer": "Frații și surorile voastre din Polinezia Franceză",
    "date": "20250705",
    "no": "1",
    "displayDate": "Sabat, 5 iulie 2025",
    "paragraph": [
        {
            "text": "Adesea asociată cu peisaje tropicale și idilice, insula Tahiti se află în Polinezia Franceză, un teritoriu de peste mări al Franței, care cuprinde 121 de insule pe o suprafață de 1.359 de mile pătrate (3.418 kilometri pătrați), întinzându-se pe mai mult de 1.242 de mile pătrate (2.000 kilometri pătrați) din sudul Oceanului Pacific."
        },
        {
            "text": "De-a lungul istoriei, credințele politeiste ale locuitorilor acestor insule au dus la multe practici păgâne, inclusiv cultul soarelui, canibalismul și cultul spiritelor. Răspândirea creștinismului a adus schimbări prin eforturile misionarilor creștini britanici care au venit pe aceste insule în 1797. Francezii au colonizat ulterior zona la sfârșitul anilor 1800. Astăzi, dintre cei aproape 279.000 de locuitori, 54% sunt protestanți, 38% catolici, iar restul aderă la alte credințe."
        },
        {
            "text": "Mesajul Reformei a ajuns în Polinezia Franceză în 1982 prin vizita fratelui A. C. Sas. Primii membri, în total 24 de suflete, au fost botezați un an mai târziu. Mesajul evanghelic a continuat să se răspândească pe insule și mai multe grupuri de biserică au fost formate de atunci."
        },
        {
            "text": "Din păcate, până în prezent, biserica noastră din Polinezia Franceză nu are o clădire proprie și frații noștri se întâlnesc în structuri închiriate sau pe terenuri private deținute de membri. Prin harul lui Dumnezeu, în 2013, după multă rugăciune și post, a fost găsit un teren în districtul Arue, la aproape 20 de kilometri de Papeete, Tahiti."
        },
        {
            "text": "Puținii membri ai acestei biserici au depus eforturi de sacrificiu de sine timp de mulți ani, gătind și vânzând preparate vegetariene în fiecare săptămână pentru a face posibilă achiziționarea acestui teren. În ciuda eforturilor exemplare ale fraților și surorilor noastre care au lucrat din greu pentru a plăti pentru acest teren, există o mare nevoie de o clădire care să ajute la răspândirea mesajului adevărului aici, în aceste ultime zile ale istoriei pământului."
        },
        {
            "text": "Prin urmare, apelăm la frații și surorile noastre din întreaga lume să ni se alăture în furnizarea mijloacelor necesare pentru ridicarea unei clădiri în Arue, care va servi drept biserică locală și loc pentru seminare, întâlniri de tabără și lucrări de sănătate în capitala Polineziei Franceze."
        },
        {
            "text": "Cuvintele înălțătoare din 1 Cronici 22:19 răsună pentru noi astăzi: „Sculați-vă dar și zidiți Sfântul Locaș al Domnului Dumnezeu.” Fie ca Dumnezeu să vă binecuvânteze din belșug și să facă lucrarea Sa să înainteze în întreaga lume."
        }
    ]
}
}*/
})()