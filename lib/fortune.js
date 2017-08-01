var fortunes = [
    "Conquer your fears or they will conquer you.",
    "Rivers need sprints",
    "Do not fear what you don't konw.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple."
];

exports.getFortune = function() {
    return fortunes[Math.floor(Math.random() * fortunes.length)];
};