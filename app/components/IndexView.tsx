import { Form } from 'remix';
import type { useTransition } from 'remix';

interface Props {
    actionData: {
        formError?: string;
        fieldErrors?: { tts: string | undefined; };
        fields?: { tts: string; };
        fileId?: string;
    } | undefined;
    formState: Record<string, unknown>;
}

export function IndexView({ actionData, formState }: Props) {
    return (
        <main>
        <h1 className="heading">TTS from Azure's free API</h1>
        <section className="container form">
          <Form method="post">
            <div>
              <label htmlFor="tts-area">Text</label>
              <textarea 
                name="tts"
                id="tts-area"
                aria-invalid={!!actionData?.formError}
                maxLength={15000}
                minLength={1}
                autoFocus
              />
              {actionData?.fieldErrors?.tts ? (
                  <p
                    className="form-tts-error"
                    role="alert"
                  >
                    {actionData.fieldErrors.tts}
                  </p>
                ) : null}
            </div>
            {actionData?.formError && (
              <p className="form-validation-error">
                {actionData.formError}
              </p>
            )}
            <button 
              className="button"
              type="submit"
              disabled={formState.state === "submitting"}
            >
              {formState.submission
                ? "Generating..."
                : "Generate"}
            </button>
          </Form>
          {!formState.submission ? (
            <audio controls>
                <source src={`audios/tts_1.mp3?${new Date().getTime()}`} type="audio/mpeg"/>
                Your browser does not support the audio tag.
            </audio>
          ) : (
            <div className="audio-skeleton">
                <p>Constructing audio player...</p>
            </div>
          )}
        </section>
        <footer className="container footer">
            <ul>
                <li><p>For fun</p></li>
                <li><p>Made with <a href="https://remix.run/" target="__blank">Remix</a></p></li>
                <li><p>Styles are taken from <a href="https://remix-jokes.lol/" target="__blank">Remix Jokes</a></p></li>
            </ul>
        </footer>
      </main>
    );
}