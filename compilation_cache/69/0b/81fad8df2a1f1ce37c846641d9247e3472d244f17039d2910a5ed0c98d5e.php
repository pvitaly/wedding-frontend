<?php

/* base.html */
class __TwigTemplate_690b81fad8df2a1f1ce37c846641d9247e3472d244f17039d2910a5ed0c98d5e extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        // line 1
        echo "<!DOCTYPE html>
<!--[if IE 8]><html class=\"no-js lt-ie9\" lang=\"en\" ><![endif]-->
<!--[if gt IE 8]><!-->
<html class=\"no-js\" lang=\"en\">
<!--<![endif]-->
<head>
<title>Kendra and Vitaly's Wedding | 6.7.14</title>
<meta charset=\"UTF-8\">
<meta name=\"viewport\" content=\"width=device-width\" />
<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />

<link rel=\"icon\" type=\"image/x-icon\" href=\"favicon.ico\" />

<link href='http://fonts.googleapis.com/css?family=EB+Garamond'
\trel='stylesheet' type='text/css'>
<link rel=\"stylesheet\"
\thref=\"//netdna.bootstrapcdn.com/bootstrap/3.0.1/css/bootstrap.min.css\">
<link rel=\"stylesheet\" type=\"text/css\" href=\"css/wedding.css\" />
<script type=\"text/javascript\" src=\"js/vendor/custom-modernizr.js\"></script>
<!--[if IE]><script src=\"http://html5shim.googlecode.com/svn/trunk/html5.js\"></script><![endif]-->

<script>
\t(function(i, s, o, g, r, a, m) {
\t\ti['GoogleAnalyticsObject'] = r;
\t\ti[r] = i[r] || function() {
\t\t\t(i[r].q = i[r].q || []).push(arguments)
\t\t}, i[r].l = 1 * new Date();
\t\ta = s.createElement(o), m = s.getElementsByTagName(o)[0];
\t\ta.async = 1;
\t\ta.src = g;
\t\tm.parentNode.insertBefore(a, m)
\t})(window, document, 'script', '//www.google-analytics.com/analytics.js',
\t\t\t'ga');

\tga('create', 'UA-46090647-1', 'kendraandvitalywedding.com');
\tga('send', 'pageview');
</script>
</head>
<body>

";
        // line 41
        $this->env->loadTemplate("navbar.html")->display($context);
        // line 42
        echo "
<div class=\"container\" id=\"content\">

";
        // line 45
        $this->env->loadTemplate("wedding-info.html")->display($context);
        // line 46
        $this->env->loadTemplate("aboutus.html")->display($context);
        // line 47
        $this->env->loadTemplate("ceremony.html")->display($context);
        // line 48
        $this->env->loadTemplate("reception.html")->display($context);
        // line 49
        $this->env->loadTemplate("wedding-party.html")->display($context);
        // line 50
        $this->env->loadTemplate("hotel.html")->display($context);
        // line 51
        $this->env->loadTemplate("registry.html")->display($context);
        // line 52
        $this->env->loadTemplate("instagram.html")->display($context);
        // line 53
        $this->env->loadTemplate("rsvp-modal.html")->display($context);
        // line 54
        $this->env->loadTemplate("ceremony-map.html")->display($context);
        // line 55
        echo "

</div><!-- container div -->

<script type=\"text/javascript\"
\tsrc=\"js/vendor/jquery.js\"></script>
<script
\tsrc=\"//netdna.bootstrapcdn.com/bootstrap/3.0.1/js/bootstrap.min.js\"></script>
<script type=\"text/javascript\"
\tsrc=\"js/jquery.zoom.min.js\"></script>
<script type=\"text/javascript\" src=\"js/instafeed.min.js\"></script>
<script type=\"text/javascript\" src=\"js/wedding.js\"></script>

</body>
</html>";
    }

    public function getTemplateName()
    {
        return "base.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  88 => 55,  86 => 54,  84 => 53,  82 => 52,  80 => 51,  78 => 50,  76 => 49,  74 => 48,  72 => 47,  70 => 46,  68 => 45,  63 => 42,  61 => 41,  19 => 1,);
    }
}
