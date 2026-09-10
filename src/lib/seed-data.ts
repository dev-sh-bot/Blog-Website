import type { Author, BlogPost, Taxonomy } from "./types";
import { calculateReadingTime, slugify } from "./utils";

const image = (id: string, width = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

// Fictional author profiles and sample editorial content for the local demo.
export const demoAuthors: Author[] = [
  { id: "sarah-ahmed", name: "Sarah Ahmed", slug: "sarah-ahmed", bio: "Exploring everyday life, personal growth, and thoughtful approaches to wellbeing.", avatarUrl: image("photo-1494790108377-be9c29b29330", 160) },
  { id: "ali-khan", name: "Ali Khan", slug: "ali-khan", bio: "Writing about food, welcoming homes, and the small rituals that bring people together.", avatarUrl: image("photo-1500648767791-00dcc994a43e", 160) },
  { id: "david-wilson", name: "David Wilson", slug: "david-wilson", bio: "Finding stories in travel, the natural world, and the ways we live with technology.", avatarUrl: image("photo-1507003211169-0a1dd7228f2d", 160) },
  { id: "emily-carter", name: "Emily Carter", slug: "emily-carter", bio: "A curious voice on books, creativity, relationships, and finding your own way with words.", avatarUrl: image("photo-1531123897727-8f129e1688ce", 160) },
];

export const demoCategories: Taxonomy[] = [
  { id: "lifestyle", name: "Lifestyle", slug: "lifestyle", description: "Inspiration for the beautifully ordinary." },
  { id: "health-wellness", name: "Health & Wellness", slug: "health-wellness", description: "Thoughtful perspectives on everyday wellbeing." },
  { id: "travel", name: "Travel", slug: "travel", description: "New places, slower journeys, wider horizons." },
  { id: "food-drink", name: "Food & Drink", slug: "food-drink", description: "Good food and the stories around the table." },
  { id: "blogging", name: "Blogging", slug: "blogging", description: "Find your voice and share your perspective." },
  { id: "personal-growth", name: "Personal Growth", slug: "personal-growth", description: "Learning, reflection, and room to grow." },
  { id: "home-living", name: "Home & Living", slug: "home-living", description: "Spaces that feel comfortable and your own." },
  { id: "arts-culture", name: "Arts & Culture", slug: "arts-culture", description: "Books, creative lives, and fresh perspectives." },
  { id: "relationships", name: "Relationships", slug: "relationships", description: "The connections that make a life." },
  { id: "money-work", name: "Money & Work", slug: "money-work", description: "Everyday perspectives on working life." },
  { id: "technology", name: "Technology", slug: "technology", description: "Digital life, through a human lens." },
  { id: "nature-outdoors", name: "Nature & Outdoors", slug: "nature-outdoors", description: "A little more wonder, closer to the wild." },
];

export const demoTags: Taxonomy[] = ["Everyday Life", "Slow Living", "Wellbeing", "Travel Notes", "Food", "Writing", "How To", "Home", "Books", "Creativity", "Learning", "Connection", "Working Life", "Personal Growth", "Nature", "Digital Life", "Journaling"].map((name) => ({ id: slugify(name), name, slug: slugify(name) }));

type DemoStory = {
  title: string;
  category: string;
  author: string;
  image: string;
  alt: string;
  excerpt: string;
  heading: string;
  intro: string;
  body: string;
  tips: string[];
  closing: string;
  tags: string[];
  views: number;
};

const stories: DemoStory[] = [
  {
    "title": "The Art of Finding Joy in the Everyday",
    "category": "lifestyle",
    "author": "sarah-ahmed",
    "image": "photo-1470770841072-f978cf4d019e",
    "alt": "A quiet lakeside landscape surrounded by mountains",
    "excerpt": "A slower weekend, a favorite corner, a conversation that stays with you. A fresh look at the ordinary things that make life feel full.",
    "heading": "Start with what is already here",
    "intro": "Not every memorable day needs a grand plan. Sometimes it begins with revisiting a familiar place, cooking something you love, or making room for an unhurried conversation.",
    "body": "Think of this as an invitation to notice, rather than a checklist to complete. The details that matter will be different for everyone: light across a kitchen table, a well-loved book, or the sound of your neighborhood waking up.",
    "tips": [
      "Revisit a place close to home that you usually hurry past.",
      "Write down one ordinary detail you would like to remember.",
      "Leave a little space in your weekend for an unscheduled moment."
    ],
    "closing": "A meaningful day can be a small one. Let your own interests, circumstances, and energy decide what it looks like.",
    "tags": [
      "everyday-life",
      "slow-living"
    ],
    "views": 2860
  },
  {
    "title": "A Gentler Morning, on Your Own Terms",
    "category": "health-wellness",
    "author": "sarah-ahmed",
    "image": "photo-1490645935967-10de6ba17061",
    "alt": "A colorful breakfast spread with fruit and everyday ingredients",
    "excerpt": "Forget the perfect routine. Explore what a more comfortable, personal start to the day might look like for you.",
    "heading": "A routine that belongs to you",
    "intro": "Morning routines often come packaged as a single ideal schedule. Real mornings are more varied: shift work, family responsibilities, health needs, and personal preferences all shape what is possible.",
    "body": "This is a reflective exercise, not a prescription. You might enjoy a quiet breakfast, a favorite song, or simply putting tomorrow’s essentials in one place. A useful routine can change from day to day.",
    "tips": [
      "Notice which parts of your morning feel rushed and which feel comfortable.",
      "Choose one optional ritual you genuinely enjoy.",
      "Adapt any idea to your needs instead of treating it as a rule."
    ],
    "closing": "This sample wellbeing article is for general interest, not medical advice. For questions about your health or changes to an existing care plan, speak with a qualified healthcare professional.",
    "tags": [
      "wellbeing",
      "everyday-life"
    ],
    "views": 3510
  },
  {
    "title": "The Beauty of Taking the Scenic Route",
    "category": "travel",
    "author": "david-wilson",
    "image": "photo-1476514525535-07fb3b4ae5f1",
    "alt": "A mountain lake with a small lakeside village",
    "excerpt": "Less rushing between landmarks, more time to discover a place. A thoughtful approach to your next escape.",
    "heading": "Leave space between the plans",
    "intro": "A trip can become a list of places to collect. Another possibility is to choose fewer stops and give each one room: a local market, an interesting street, or an afternoon beside the water.",
    "body": "Before you go, decide what you most want from the experience. Is it conversation, food, landscape, art, or simply a change of scene? That answer can help you choose which plans to keep and which to leave open.",
    "tips": [
      "Choose one main activity for each day, with room around it.",
      "Check current opening times, accessibility, and local conditions before visiting.",
      "Respect the people who live in the places you explore."
    ],
    "closing": "There is no single right pace for a holiday. Build in the flexibility that fits your interests, companions, and budget.",
    "tags": [
      "travel-notes",
      "slow-living"
    ],
    "views": 4120
  },
  {
    "title": "Simple Food, Shared Around the Table",
    "category": "food-drink",
    "author": "ali-khan",
    "image": "photo-1512621776951-a57141f2eefd",
    "alt": "A bowl of colorful vegetables arranged for a meal",
    "excerpt": "A few familiar ingredients and people you enjoy: inspiration for making an ordinary meal feel like an occasion.",
    "heading": "Make the gathering the main event",
    "intro": "A shared meal does not have to be an elaborate production. A familiar dish, a few toppings in separate bowls, and a place for everyone to sit can be enough to set the scene.",
    "body": "Think about the people at your table before deciding on the menu. Ask about dietary needs and preferences, and choose a preparation you already know. Keeping the plan simple leaves more attention for the gathering itself.",
    "tips": [
      "Build the menu around one familiar main dish.",
      "Ask guests about allergies and dietary requirements in advance.",
      "Let people add their own toppings and finishing touches."
    ],
    "closing": "The memorable part of a meal may be the conversation around it. There is plenty of room for a table that feels welcoming rather than perfect.",
    "tags": [
      "food",
      "everyday-life"
    ],
    "views": 3080
  },
  {
    "title": "Start a Blog That Sounds Like You",
    "category": "blogging",
    "author": "emily-carter",
    "image": "photo-1455390582262-044cdead277a",
    "alt": "A notebook and pen ready for a writing session",
    "excerpt": "From choosing a subject to drafting your first post, a friendly starting point for sharing your own perspective.",
    "heading": "Begin with a question you care about",
    "intro": "A blog does not need to cover everything. Your first post can begin with one question, experience, or observation that you would enjoy talking through with another person.",
    "body": "Choose the reader you have in mind and write a working title. Then draft a short opening, two or three useful points, and a closing thought. Structure helps your idea travel without taking away your voice.",
    "tips": [
      "List three subjects you return to in everyday conversation.",
      "Draft one post before worrying about a publishing schedule.",
      "Read your draft aloud and replace phrases you would never actually say."
    ],
    "closing": "Your first post is a beginning, not a final definition of your voice. Leave yourself room to learn what you enjoy writing and what readers find useful.",
    "tags": [
      "writing",
      "how-to"
    ],
    "views": 3790
  },
  {
    "title": "A Home That Makes Room for Real Life",
    "category": "home-living",
    "author": "ali-khan",
    "image": "photo-1600210492486-724fe5c67fb0",
    "alt": "A welcoming living room with a sofa and natural light",
    "excerpt": "Comfort, character, and a little breathing room. Everyday ideas for spaces that feel lived in and loved.",
    "heading": "Notice how you use the room",
    "intro": "Before changing a room, spend a little time noticing it. Where do you naturally sit? Which objects do you reach for? What keeps ending up in the wrong place?",
    "body": "Those observations can become a more personal starting point than a photograph of someone else’s home. Move one object, clear one useful surface, or bring a favorite possession into view. You do not need to transform everything at once.",
    "tips": [
      "Start with a corner you use every day.",
      "Try rearranging what you own before buying something new.",
      "Keep the needs of everyone sharing the space in mind."
    ],
    "closing": "A home is allowed to reflect an ordinary, changing life. Make room for comfort and usefulness alongside the things you find beautiful.",
    "tags": [
      "home",
      "how-to"
    ],
    "views": 2410
  },
  {
    "title": "The Quiet Pleasure of Getting Lost in a Book",
    "category": "arts-culture",
    "author": "emily-carter",
    "image": "photo-1499750310107-5fef28a66643",
    "alt": "Books and a notebook on a cozy writing desk",
    "excerpt": "A celebration of reading without targets, trends, or the pressure to finish every book you begin.",
    "heading": "Follow the story that interests you",
    "intro": "A reading life can be wonderfully irregular. You might stay with one book for weeks, reread an old favorite, or move between a novel, a collection of essays, and a magazine.",
    "body": "Instead of treating your shelf as a task list, consider it an invitation. Choose something that suits your curiosity now. Libraries, borrowed books, and conversations with friends offer plenty of ways to discover a different voice.",
    "tips": [
      "Ask someone what they enjoyed reading and why.",
      "Give yourself permission to pause a book that is not right for you.",
      "Keep a sentence or question from a story that stays with you."
    ],
    "closing": "The point is not to read the most. It is to find something you are glad to have spent time with.",
    "tags": [
      "books",
      "creativity"
    ],
    "views": 2240
  },
  {
    "title": "Learning Something New, Just Because",
    "category": "personal-growth",
    "author": "sarah-ahmed",
    "image": "photo-1456324504439-367cee3b3c32",
    "alt": "An open notebook beside a laptop on a desk",
    "excerpt": "You do not need to turn every interest into an achievement. Make a little room for the pleasure of being a beginner.",
    "heading": "Let curiosity choose the starting point",
    "intro": "Some interests are worth following without a larger plan. Sketching a familiar object, learning a few words in another language, or trying a new style of writing can be satisfying in its own right.",
    "body": "Choose a small experiment with a clear stopping point. The aim is to discover whether you enjoy the activity, not to become impressive at it immediately. You can keep going, change direction, or decide that another interest suits you better.",
    "tips": [
      "Pick something you would try even if nobody saw the result.",
      "Use what you already have where possible.",
      "Leave room for mistakes and a different pace of progress."
    ],
    "closing": "An interest does not need to become a career or a habit to be worthwhile. Sometimes trying it is the whole point.",
    "tags": [
      "learning",
      "creativity"
    ],
    "views": 1870
  },
  {
    "title": "Making Time for the People Who Matter",
    "category": "relationships",
    "author": "emily-carter",
    "image": "photo-1529156069898-49953e39b3ac",
    "alt": "Friends spending time together outdoors",
    "excerpt": "A familiar walk, a thoughtful message, a shared meal. Small ways to keep everyday connection in view.",
    "heading": "Choose an invitation that feels possible",
    "intro": "Spending time together does not always require a special occasion. An invitation can be simple and specific: a short catch-up, a walk somewhere familiar, or a meal at home.",
    "body": "Different people have different amounts of time and social energy. Ask what works for the other person and make it easy to say no or suggest another day. The most useful plan is one that fits both of you.",
    "tips": [
      "Suggest a low-pressure activity with a clear time and place.",
      "Listen to the other person’s preferences and boundaries.",
      "Let a thoughtful message count when meeting is not practical."
    ],
    "closing": "Connection can take many forms. Keep the invitations kind, the expectations flexible, and the choice mutual.",
    "tags": [
      "connection",
      "everyday-life"
    ],
    "views": 2680
  },
  {
    "title": "A Working Week with Room for a Life",
    "category": "money-work",
    "author": "sarah-ahmed",
    "image": "photo-1498050108023-c5249f4df085",
    "alt": "A light-filled workspace with a laptop and notebook",
    "excerpt": "A reflective look at priorities, practical boundaries, and the parts of life that sit outside a job title.",
    "heading": "Make the trade-offs visible",
    "intro": "The demands of work are different for everyone, and not every schedule can be rearranged. Begin by distinguishing the parts you control from the obligations you need to work around.",
    "body": "Write down the commitments already in your week. Then consider where a clearer conversation, a smaller task list, or an agreed handover might help. Treat these as questions to explore, not a universal formula for balance.",
    "tips": [
      "Choose a short list of priorities rather than an endless one.",
      "Clarify expectations with the people who depend on your work.",
      "Plan around your actual circumstances, not an idealized schedule."
    ],
    "closing": "This is a general-interest reflection on working life, not employment or financial advice. Useful changes depend on your circumstances and available choices.",
    "tags": [
      "working-life",
      "personal-growth"
    ],
    "views": 2030
  },
  {
    "title": "Finding a Little Wilderness Close to Home",
    "category": "nature-outdoors",
    "author": "david-wilson",
    "image": "photo-1441974231531-c6227db76b6e",
    "alt": "Sunlight filtering through a green forest",
    "excerpt": "You may not need a distant adventure to notice the natural world. Start with a nearby path, garden, or patch of sky.",
    "heading": "Look again at a familiar place",
    "intro": "A small green space can change from one visit to the next. Light, weather, birds, and the passing seasons make familiar surroundings worth another look.",
    "body": "Choose an accessible place that suits your needs and the conditions on the day. A bench beside a tree or a view from an open window can be a starting point too. The exercise is simply to observe without needing to collect or change anything.",
    "tips": [
      "Check local access information and conditions before setting out.",
      "Leave plants and wildlife undisturbed.",
      "Notice one detail you did not see on your last visit."
    ],
    "closing": "Curiosity is portable. A moment of attention can begin wherever you happen to be.",
    "tags": [
      "nature",
      "slow-living"
    ],
    "views": 3250
  },
  {
    "title": "A More Intentional Relationship with Your Phone",
    "category": "technology",
    "author": "david-wilson",
    "image": "photo-1516321318423-f06f85e504b3",
    "alt": "People using digital devices together at a table",
    "excerpt": "Keep what is useful, reconsider what is automatic. An everyday look at the place technology has in your life.",
    "heading": "Decide what you want the tool to do",
    "intro": "Your phone can be a map, a camera, a way to stay in touch, and a source of entertainment. The interesting question is which of those roles you want to make more space for.",
    "body": "Look at your own preferences before changing settings or removing apps. You might want important messages to remain easy to find while moving less useful shortcuts out of the way. There is no need to turn it into an all-or-nothing project.",
    "tips": [
      "Keep essential communication and accessibility needs in view.",
      "Review which notifications you actually want to receive.",
      "Try one reversible change and see whether you prefer it."
    ],
    "closing": "The aim is a setup that serves your life. Different people will arrive at different answers.",
    "tags": [
      "digital-life",
      "everyday-life"
    ],
    "views": 1760
  },
  {
    "title": "Keep a Wellbeing Journal Without Another To-Do List",
    "category": "health-wellness",
    "author": "sarah-ahmed",
    "image": "photo-1499750310107-5fef28a66643",
    "alt": "An open journal with a pen on a wooden desk",
    "excerpt": "A few optional prompts for noticing your days, without scores, streaks, or the expectation to write perfectly.",
    "heading": "A page for noticing, not judging",
    "intro": "A personal journal can be as informal as a few words on a page. You might write about a moment you enjoyed, something that felt difficult, or a question you want to return to.",
    "body": "There is no required frequency or format. Skip prompts that do not suit you, keep the writing private if you prefer, and stop if the activity feels unhelpful. A notebook is an option, not a measure of how well you are doing.",
    "tips": [
      "Try a simple prompt such as: What stood out today?",
      "Use words, sketches, or lists in a format that feels natural.",
      "Keep personal information somewhere you are comfortable storing it."
    ],
    "closing": "This sample article offers general reflective prompts, not a treatment or a substitute for professional care. Speak with a qualified professional about health concerns.",
    "tags": [
      "wellbeing",
      "journaling"
    ],
    "views": 2970
  },
  {
    "title": "How to Find Ideas for Your Next Blog Post",
    "category": "blogging",
    "author": "emily-carter",
    "image": "photo-1455390582262-044cdead277a",
    "alt": "Handwritten notes beside a pen",
    "excerpt": "Your next story might be hiding in a reader’s question, an everyday observation, or something you learned the hard way.",
    "heading": "Build an idea collection you will actually use",
    "intro": "Instead of waiting for a perfect topic, collect small starting points as they occur to you. A sentence, a reader’s question, or a note about something you tried can become a useful draft later.",
    "body": "When you return to the list, choose an idea you can make specific. Who is it for? What question will it answer? What example could make it clearer? A focused post is often easier to start than an attempt to say everything about a subject.",
    "tips": [
      "Keep your notes in one easy-to-reach place.",
      "Turn broad themes into a single reader question.",
      "Use your own examples and credit sources where appropriate."
    ],
    "closing": "An idea list is a collection of possibilities, not a set of obligations. Choose the one you are most interested in exploring today.",
    "tags": [
      "writing",
      "how-to"
    ],
    "views": 3220
  },
  {
    "title": "A Weekend Away with No Packed Itinerary",
    "category": "travel",
    "author": "david-wilson",
    "image": "photo-1507525428034-b723cf961d3e",
    "alt": "A sandy beach with turquoise water",
    "excerpt": "A change of scene, one or two plans, and permission to leave the rest open.",
    "heading": "Plan the essentials, leave the rest flexible",
    "intro": "A short break can feel crowded before it begins. Start with the practical details you need to know, then choose a small number of things you would genuinely enjoy doing.",
    "body": "Think about travel time, access needs, food, and where you will stay. Check current conditions and booking terms directly before making commitments. Once those essentials are clear, an unplanned afternoon can remain an option rather than a problem to solve.",
    "tips": [
      "Choose a destination that fits the time available.",
      "Check transport and accommodation details before committing.",
      "Agree on the pace of the trip with anyone joining you."
    ],
    "closing": "A flexible itinerary is still a plan. It simply leaves room for how the day turns out.",
    "tags": [
      "travel-notes",
      "everyday-life"
    ],
    "views": 2490
  },
  {
    "title": "The Ritual of Making Something by Hand",
    "category": "arts-culture",
    "author": "emily-carter",
    "image": "photo-1558655146-d09347e92766",
    "alt": "Colorful creative materials arranged on a work surface",
    "excerpt": "Paper, color, a little patience: an invitation to make something without needing it to be perfect.",
    "heading": "Begin with familiar materials",
    "intro": "Making something can start with supplies you already own: a pencil, a sheet of paper, scraps of fabric, or a few photographs. Choose a small project that you can explore without a complicated setup.",
    "body": "You might copy the outline of a favorite object, assemble a page of colors, or write a note by hand. Keep the first attempt small enough that you can enjoy the process rather than spend all your attention on the finished result.",
    "tips": [
      "Clear a small surface and gather a few materials.",
      "Choose a project that matches the time you have.",
      "Keep or share the result only if you want to."
    ],
    "closing": "A handmade object can be imperfect and still feel entirely your own. That is part of its character.",
    "tags": [
      "creativity",
      "how-to"
    ],
    "views": 2150
  },
  {
    "title": "Make Your Kitchen a Place You Enjoy Using",
    "category": "home-living",
    "author": "ali-khan",
    "image": "photo-1495474472287-4d71bcdd2085",
    "alt": "Coffee being prepared in a welcoming kitchen",
    "excerpt": "A practical look at the little arrangements that make everyday cooking feel more personal.",
    "heading": "Arrange for the meals you actually make",
    "intro": "A useful kitchen reflects your own habits. Start by noticing the ingredients, utensils, and surfaces you use most often, rather than planning around an imagined version of how you should cook.",
    "body": "Try one small rearrangement at a time. Keep the tools you reach for together and make space to prepare the meals you enjoy. Consider everyone who shares the kitchen, including any access needs.",
    "tips": [
      "Choose one drawer or shelf instead of the whole room.",
      "Group items according to how you use them.",
      "Keep safe storage and clear working surfaces in mind."
    ],
    "closing": "Let the room evolve through everyday use. The best arrangement is the one that works for your household.",
    "tags": [
      "home",
      "food"
    ],
    "views": 1960
  },
  {
    "title": "A Recipe Notebook Full of Your Own Stories",
    "category": "food-drink",
    "author": "ali-khan",
    "image": "photo-1490645935967-10de6ba17061",
    "alt": "Fresh ingredients arranged around a breakfast table",
    "excerpt": "Keep the dishes, little adaptations, and memories you want to return to—one page at a time.",
    "heading": "Write down more than the ingredients",
    "intro": "A personal recipe notebook can hold more than instructions. Add where a dish came from, who shared it with you, and the occasion you associate with making it.",
    "body": "Leave space for practical notes as well: the pan you used, an adjustment you liked, or how much the recipe made in your kitchen. Record ingredient substitutions clearly, especially when cooking for people with dietary restrictions.",
    "tips": [
      "Credit the person or source behind a recipe.",
      "Record quantities and changes as you cook.",
      "Add a memory, photograph, or serving idea if you like."
    ],
    "closing": "Over time, a few useful pages can become a record of the people and places that have found their way to your table.",
    "tags": [
      "food",
      "journaling"
    ],
    "views": 1820
  }
];

export const demoPosts: BlogPost[] = stories.map((story, index) => {
  const publishedAt = new Date(Date.UTC(2026, 8, 8 - index, 10)).toISOString();
  const content = `<p>${story.intro}</p><h2>${story.heading}</h2><p>${story.body}</p><h3>Make it practical</h3><p>Start with the version that fits your real life, not an imagined perfect one. Notice what you already know, what needs checking, and what would make the next small step easier. The most useful ideas are the ones you can adapt to your time, energy, budget, and the people around you.</p><blockquote>Curiosity becomes useful when it gives us a kinder, clearer way to look at ordinary choices.</blockquote><h2>A few ideas to explore</h2><ul>${story.tips.map((tip) => `<li>${tip}</li>`).join("")}</ul><h3>Keep the question open</h3><p>There is no single formula behind this subject. Try one idea, pay attention to what changes, and keep the parts that feel genuinely useful. A thoughtful approach leaves room to revise the plan when your circumstances or interests change.</p><p>${story.closing}</p>`;
  const featuredImage = { url: image(story.image), alt: story.alt };
  return {
    id: `post-${index + 1}`, title: story.title, slug: slugify(story.title), excerpt: story.excerpt, content,
    featuredImage, authorId: story.author, categoryId: story.category, tagIds: story.tags,
    template: (["magazine", "classic", "minimal"] as const)[index % 3], status: "published", publishedAt,
    createdAt: publishedAt, updatedAt: publishedAt, readingTime: calculateReadingTime(content), viewCount: story.views,
    featured: [0, 1, 4, 10].includes(index),
    seo: { title: `${story.title} | Insightly`, description: story.excerpt, ogImage: featuredImage.url, twitterCard: "summary_large_image" },
  };
});
