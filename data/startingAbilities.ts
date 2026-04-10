export interface StartingAbility {
    name: string;
    description: string;
}

export const STARTING_ABILITIES: StartingAbility[] = [
    {
        name: 'Touch',
        description: 'You steal the breath and sleep of everything you touch. While touching any creature that breathes, it cannot breathe. After touching any creature that sleeps, it won\'t be able to sleep the next night. You recover Stamina for every creature you touch. Your employer feels everything you touch.'
    },
    {
        name: 'Sight',
        description: 'You have a third eye that can see illusions, invisibility, and lies. You can also see up to 10 feet through walls. When you attempt to sleep and close your third eye, it might hurt. Your employer can see everything you see.'
    },
    {
        name: 'Taste',
        description: 'When you lick something, you taste its possible future. When you consume part of a once-living thing, you experience flashes of its past – memories, emotions, fears. Your jaw unhinges and your digestion is unnaturally resilient. You can\'t always control your cravings.'
    },
    {
        name: 'Sound',
        description: 'You absorb all sounds within arms reach of you. They may be randomly released later, and possibly all at once. Once per day you can release the sounds and speak for 1 minute.'
    },
    {
        name: 'Smell',
        description: 'Your ability to smell is greatly enhanced to doglike levels and you can detect the desires of sentient beings. The smell of fear becomes intoxicating.'
    },
    {
        name: 'Life',
        description: 'You may restore a dead creature to life by touching its corpse, provided it died within the last hour. The resurrected being remains alive only while you maintain physical contact. If contact is broken, it dies immediately. In combat, only one of you may roll Power Dice and use abilities each round. You may only have one such resurrected being at a time.'
    },
    {
        name: 'Death',
        description: 'While you are asleep, any creature that touches you dies. Your lifespan increases in accordance with how long they would have lived (you gain 1 year for every 10 they would have lived). You might sleepwalk at night.'
    },
    {
        name: 'Smile',
        description: 'You can wear the faces of your victims. Literally. You can easily peel the face off a humanoid creature and wear it as your own. You gain their voice & appearance, and your body shape changes to match theirs. The face rots in 6 hours and you revert to your normal appearance. Some faces become irresistible.'
    },
    {
        name: 'Despair',
        description: 'Your tears are a slow-acting, undetectable poison. Anyone who was truly happy immediately before or after consuming them will die within hours. The poison remains active in their system for 3 hours once ingested. Crying tears of joy is very dangerous for your health.'
    },
    {
        name: 'Vengeance',
        description: 'You may awaken with thoughts of vengeance against someone who has wronged you. You learn their location at all times and all doors that would stand between you and your victim are mysteriously unlocked. Your employer keeps track of every target you fail to kill.'
    },
    {
        name: 'Mercy',
        description: 'You can place a cursed mark on a willing recipient. You gain 1 gold every day for each living marked victim. Your employer failed to mention what the mark does.'
    },
    {
        name: 'Curious',
        description: 'Each dawn, you receive a vision of a person. A vague description, a location hint, and a felt presence. If you find them and persuade them to speak your true name three times, you learn one new ritual spell. That person may summon you by speaking your name three times.'
    }
];
