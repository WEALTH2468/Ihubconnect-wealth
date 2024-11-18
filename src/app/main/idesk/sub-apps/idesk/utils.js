export const parseTextAsLinkIfURL = (text) => {
  // const urlRegex =
  //   /^((https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(:\d+)?(\/[^\s]*)?)$/i;
  // if (urlRegex.test(text)) {
  //   // Ensure URL has 'http' or 'https' prefix
  //   const href = text.startsWith('http') ? text : `https://${text}`;
  //   return (
  //     <a
  //       href={href}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       style={{
  //         color: 'blue',
  //         textDecoration: 'underline',
  //         cursor: 'pointer',
  //         backgroundColor: 'transparent',
  //       }}
  //     >
  //       {text}
  //     </a>
  //   );
  // }

  // // If not a URL, return plain text
  // return text;

  const textArray = text.split(' ');
  const urlRegex =
    /^((https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(:\d+)?(\/[^\s]*)?)$/i;

  const parsedText = textArray.map((word, index) => {
    if (urlRegex.test(word)) {
      // Ensure URL has 'http' or 'https' prefix
      const href = word.startsWith('http') ? word : `https://${word}`;
      return (
        <>
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'blue',
              textDecoration: 'underline',
              cursor: 'pointer',
              backgroundColor: 'transparent',
            }}
          >
            {word}
          </a>{' '}
        </>
      );
    }
    return word + ' ';
  });

  return parsedText;
};
