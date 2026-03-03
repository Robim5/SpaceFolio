const skills = [
    {
        title: 'Languages',
        iconType: 'code',
        skills: [
            { name: 'JavaScript', abbr: 'JS' },
            { name: 'HTML5', abbr: '<>' },
            { name: 'CSS3', abbr: '#' },
            { name: 'PHP', abbr: 'PHP' },
            { name: 'Python', abbr: 'PY' },
            { name: 'C#', abbr: 'C#' },
        ],
    },
    {
        title: 'Frameworks & Libraries',
        iconType: 'layers',
        skills: [
            { name: 'React', abbr: 'Re' },
            { name: 'Node.js', abbr: 'Nd' },
            { name: 'Tailwind CSS', abbr: 'TW' },
            { name: 'Bootstrap', abbr: 'Bs' },
        ],
    },
    {
        title: 'Databases & Backend',
        iconType: 'database',
        skills: [
            { name: 'Supabase', abbr: 'Sb' },
            { name: 'Firebase', abbr: 'Fb' },
            { name: 'MySQL', abbr: 'SQ' },
            { name: 'XAMPP', abbr: 'XP' },
            { name: 'phpMyAdmin', abbr: 'PA' },
        ],
    },
    {
        title: 'Tools & Software',
        iconType: 'tools',
        subcategories: [
            {
                label: 'Editors / IDEs',
                skills: [
                    { name: 'VS Code', abbr: 'VC' },
                    { name: 'Visual Studio', abbr: 'VS' },
                    { name: 'Cursor', abbr: 'Cu' },
                    { name: 'Android Studio', abbr: 'AS' },
                ],
            },
            {
                label: 'Version Control',
                skills: [
                    { name: 'Git', abbr: 'Gt' },
                    { name: 'GitHub', abbr: 'GH' },
                ],
            },
            {
                label: 'Design',
                skills: [
                    { name: 'Figma', abbr: 'Fi' },
                    { name: 'Canva', abbr: 'Ca' },
                    { name: 'Aseprite', abbr: 'As' },
                ],
            },
            {
                label: 'Game Engines',
                skills: [
                    { name: 'Unity', abbr: 'Un' },
                    { name: 'Godot', abbr: 'Go' },
                    { name: 'Unreal Engine', abbr: 'UE' },
                ],
            },
            {
                label: 'Productivity',
                skills: [
                    { name: 'PowerPoint', abbr: 'PP' },
                    { name: 'Word', abbr: 'Wd' },
                    { name: 'Excel', abbr: 'Ex' },
                ],
            },
            {
                label: 'Others',
                skills: [
                    { name: 'Postman', abbr: 'Pm' },
                    { name: 'AI Tools', abbr: 'AI' },
                ],
            },
        ],
    },
];

export default skills;
