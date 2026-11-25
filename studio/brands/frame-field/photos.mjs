// Photographs are ordered as they appear in each project. Dimensions describe the full-size WebP.
const frames = {
  "portraits-a": [
    ["A sitter in profile against charcoal.", 1536, 1024],
    ["The sitter looks straight into the lens.", 1448, 1086],
    ["A seated portrait lit from a single side.", 1024, 1536],
    ["The sitter turns into the window light.", 1024, 1536],
  ],
  "portraits-b": [
    ["A silver-haired sitter beside a pale window.", 1536, 1024],
    ["Light catches silver strands and a blue collar.", 1086, 1448],
    ["The sitter rests beside the indigo curtain.", 1086, 1448],
    ["The sitter turns toward the daylight.", 1536, 1024],
  ],
  "commercial-a": [
    ["A potter leans over her wheel.", 1448, 1086],
    ["Clay ridges form around an unfinished bowl.", 1448, 1086],
    ["Stoneware dries on open workshop shelves.", 1536, 1024],
    ["The potter inspects a bowl at the window.", 1024, 1536],
  ],
  "commercial-b": [
    ["A tan leather satchel stands on a workbench.", 1448, 1086],
    ["A brass clasp sits against saddle-brown leather.", 1448, 1086],
    ["The satchel hangs beside a workshop window.", 1536, 1024],
    ["Cut leather and stitching tools on the bench.", 1536, 1024],
  ],
  "products-a": [
    ["A perfume bottle and ceramic cup cast long shadows.", 1536, 1024],
    ["A close view of the perfume bottle catches a glint of light.", 1086, 1448],
    ["Amber glass throws a warm reflection across the tabletop.", 1536, 1024],
    ["An overhead view of glass, a cup and long shadows.", 1086, 1448],
  ],
  "products-b": [
    ["A cobalt vase and chalk bowl sit on slate.", 1536, 1024],
    ["A lip of cobalt glaze reflects the softbox.", 1441, 1092],
    ["The white bowl rests in the cobalt vase’s shadow.", 1536, 1024],
    ["The two vessels meet at the edge of the frame.", 1536, 1024],
    ["The cobalt vase and chalk bowl form two circles on slate.", 1254, 1254],
  ],
  "fashion-a": [
    ["The model stands in profile with scarlet fabric caught in the air.", 1536, 1024],
    ["The folds of the sari rise around the model’s shoulder.", 1086, 1448],
    ["A scarlet train sweeps across the pink studio floor.", 1536, 1024],
    ["The model looks over a sharply folded red drape.", 1024, 1536],
  ],
  "fashion-b": [
    ["A model in a loose suit stands on a concrete landing.", 1536, 1024],
    ["The model sits on the edge of a stair.", 1086, 1448],
    ["A pale sleeve echoes the slope of the handrail.", 1086, 1448],
    ["The model crosses the stairwell in profile.", 1536, 1024],
  ],
  "weddings-a": [
    ["A couple face each other with jasmine garlands.", 1086, 1448],
    ["Jasmine garlands lie beside green woven fabric.", 1448, 1086],
    ["The couple walk together along the courtyard wall.", 1536, 1024],
    ["The bride and groom share a quiet smile in the doorway.", 1536, 1024],
  ],
  "weddings-b": [
    ["Two figures walk together at the water’s edge.", 1536, 1024],
    ["The couple turn to each other in soft morning light.", 1448, 1086],
    ["Indigo linen and cream cotton catch the lakeside breeze.", 1536, 1024],
    ["Two silhouettes pause before a mist-covered ridge.", 1672, 941],
  ],
  "events-a": [
    ["A speaker addresses a small audience under amber light.", 1536, 1024],
    ["Audience members listen from the edge of the stage.", 1448, 1086],
    ["A microphone waits on the empty stage.", 1536, 1024],
    ["The speaker finishes a point beneath the stage light.", 1536, 1024],
  ],
  "events-b": [
    ["Visitors gather between two cobalt canvases.", 1536, 1024],
    ["Two people talk in front of a blue painting.", 1448, 1086],
    ["Blue pigment meets the white gallery wall.", 1536, 1024],
    ["A visitor studies a geometric painting.", 1536, 1024],
  ],
  "architecture-a": [
    ["An ochre stair curves above the courtyard floor.", 1536, 1024],
    ["A perforated screen casts a grid onto the floor.", 1086, 1448],
    ["The staircase climbs past a shaded opening.", 1024, 1536],
    ["Sunlight grazes the limewashed courtyard.", 1086, 1448],
  ],
  "architecture-b": [
    ["Timber shelves sit beneath a concrete skylight.", 1448, 1086],
    ["Skylight shadows fall on a concrete pier.", 1199, 1312],
    ["A row of timber study desks follows the windows.", 1536, 1024],
    ["Bookshelves frame a pool of morning light.", 1536, 1024],
  ],
  "food-a": [
    ["A crisp dosa rests on a banana leaf and steel plate.", 1448, 1086],
    ["Light catches the crisp edge of a dosa.", 1536, 1024],
    ["Chutney and sambar sit beside a fold of banana leaf.", 1536, 1024],
    ["Breakfast is set beside a bright kitchen window.", 1536, 1024],
  ],
  "food-b": [
    ["Filter coffee catches morning light on the counter.", 1536, 1024],
    ["Fresh coffee pours into the glass.", 1024, 1536],
    ["A metal coffee filter casts a long morning shadow.", 1086, 1448],
    ["A full glass sits by the bright café window.", 1536, 1024],
  ],
  "studio": [
    ["Window light falls across the shooting floor.", 1536, 1024],
    ["A photographer checks a camera on a tripod.", 1536, 1024],
    ["A softbox and reflector stand beside the portrait backdrop.", 1536, 1024],
    ["A perfume bottle sits on the still-life worktable.", 1536, 1024],
    ["The photographer pauses beside the studio window.", 1536, 1024],
    ["Paper backdrops stand beside a styling rail.", 1536, 1024],
    ["A laptop and proof prints share the editing desk.", 1536, 1024],
    ["A low bench and chairs face the studio floor.", 1536, 1024],
  ],
};

export const photos = Object.fromEntries(
  Object.entries(frames).map(([series, images]) => [
    series,
    images.map(([alt, width, height], index) => {
      const path = `/assets/frame-field/${series}${index + 1}`;
      return { src: `${path}.webp`, small: `${path}-640.webp`, alt, width, height };
    }),
  ]),
);
